<?php
/*
 *  Copyright 2024.  Baks.dev <admin@baks.dev>
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is furnished
 *  to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

declare(strict_types=1);

namespace BaksDev\Core\Messenger;

use BaksDev\Core\Cache\AppCacheInterface;
use DateInterval;
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Component\Messenger\Envelope;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\TransportNamesStamp;
use Symfony\Component\Process\Process;

final class MessageDispatch implements MessageDispatchInterface
{
    public const string CONSUMER_NAMESPACE = 'dispatch';

    private bool $dispatch = true;

    private ?string $transport = null;

    private LoggerInterface $logger;

    public function __construct(
        private readonly MessageBusInterface $messageBus,
        private readonly AppCacheInterface $cache,
        LoggerInterface $messageDispatchLogger,
    )
    {
        $this->logger = $messageDispatchLogger;
    }

    /**
     * Метод добавляет сообщение в очередь:
     * - Если имеется воркер переданного транспорта - сообщение обрабатывается асинхронно в очереди воркера
     * - Если воркера не найдено - сообщение обрабатываться синхронно
     * - Если транспорт UID - наличие запущенного воркера обязательно, в противном случае сообщение не отрабатывает
     */
    public function dispatch(object $message, array $stamps = [], ?string $transport = null): ?Envelope
    {
        if($transport)
        {
            $this->transport = $transport;

            /* Чистим кеш модуля (транспорта) */
            $cache = $this->cache->init($transport);
            $cache->clear();
        }

        if($this->dispatch === false)
        {
            return null;
        }

        foreach($stamps as $key => $stamp)
        {
            /** Если передана марка MessageDelay - преобразуем её в марку DelayStamp */
            if($stamp instanceof MessageDelay)
            {
                if(is_null($this->transport))
                {
                    throw new InvalidArgumentException('Транспорт сообщений не установлен');
                }

                $stamps[] = $stamp->getDelayStamp();
                unset($stamps[$key]);
            }
        }

        /**
         * Если указан транспорт - пробуем отправить в очередь
         */

        if($this->transport)
        {
            if($this->transport === 'test')
            {
                return null;
            }

            /* Делаем пинг на указанный транспорт */
            $isRunning = $this->isConsumer();

            /**
             * Транспорт resources (для отправки файлов на CDN) всегда должен быть запущен
             */
            if($transport === 'files-res' && $isRunning === false)
            {
                $this->logger->critical('Messanger Транспорт files-res не найден');
                return null;
            }

            /**
             * Если транспорт запущен - отправляем сообщение в очередь
             */
            if($isRunning)
            {
                return $this->messageBus->dispatch($message, array_merge($stamps, [new TransportNamesStamp([$this->transport])]));
            }

            $transportRequire = $this->isUid(); // транспорт UID

            /**
             * Если транспорт не определяется и он является UID (обязательным)
             */
            if($transportRequire)
            {
                $this->logger->critical(sprintf('Messanger Транспорт %s не найден', $this->transport));
                return null;
            }
        }

        /** Если транспорт не определяется и он не является UID (обязательным) - обрабатываем синхронно */
        return $this->messageBus->dispatch($message, $stamps);
    }

    /**
     * Метод присваивает транспорт сообщения
     */
    public function transport(string $transport): self
    {
        $this->transport = $transport;
        return $this;
    }

    /**
     * Метод проверяет, является ли указанный транспорт UID
     */
    private function isUid(): bool
    {
        return (bool) preg_match('{^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$}Di', $this->transport);
    }

    /**
     * Делаем пинг на указанный транспорт
     */
    public function isConsumer(?string $transport = null): bool
    {
        if(!$this->transport && !$transport)
        {
            return false;
        }

        $cache = $this->cache->init(self::CONSUMER_NAMESPACE);
        $cacheConsume = $cache->getItem('consume-'.trim($this->transport));

        if($cacheConsume->isHit())
        {
            return $cacheConsume->get();
        }

        /** Процесс проверки воркера указанного транспорта */

        $process = Process::fromShellCommandline('ps aux | grep php | grep messenger:consume | grep '.$this->transport);
        $process->setTimeout(30);
        $process->run();

        $result = $process->getIterator($process::ITER_SKIP_ERR | $process::ITER_KEEP_OUTPUT)->current();
        $isRunning = (!empty($result) && strripos($result, 'messenger:consume '.$this->transport.' '));

        /** Кешируем результат для следующих сообщений транспорта */

        $cacheConsume->set($isRunning);
        $cacheConsume->expiresAfter(DateInterval::createFromDateString('1 day'));
        $cache->save($cacheConsume);

        return $isRunning;
    }

    /**
     * Метод запрещает вызов отправлять сообщение в очередь (например в тестовом окружении)
     */
    public function falseDispatch(): void
    {
        $this->dispatch = false;
    }

    /**
     * При вызове диспатчера сообщения - можно передать особый модуль (отличающийся от сообщения) для сброса кеша
     * addClearCacheOther
     */
    public function addClearCacheOther(string $module): self
    {
        /* Чистим кеш модуля (транспорта) */
        $cache = $this->cache->init($module);
        $cache->clear();

        return $this;
    }
}
