<?php
/*
 *  Copyright 2025.  Baks.dev <admin@baks.dev>
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
use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\DependencyInjection\Attribute\Target;
use Symfony\Component\Messenger\Envelope;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\TransportNamesStamp;

final class MessageDispatch implements MessageDispatchInterface
{
    public const string CONSUMER_NAMESPACE = 'dispatch';

    private bool $dispatch = true;

    private ?string $transport = null;

    public function __construct(
        #[Target('messageDispatchLogger')] private readonly LoggerInterface $logger,
        private readonly MessageBusInterface $messageBus,
        private readonly AppCacheInterface $cache,
        #[Autowire(env: 'HOST')] private readonly string $HOST,
    ) {}

    /**
     * Метод добавляет сообщение в очередь:
     * - Если имеется воркер переданного транспорта - сообщение обрабатывается асинхронно в очереди воркера
     * - Если воркера не найдено - сообщение обрабатываться синхронно
     * - Если транспорт UID - наличие запущенного воркера обязательно, в противном случае сообщение не отрабатывает
     */
    public function dispatch(object $message, array $stamps = [], ?string $transport = null): ?Envelope
    {
        $this->transport = $transport;

        if($transport)
        {
            /* Чистим кеш модуля (транспорта) */
            $cache = $this->cache->init($transport);
            $cache->clear();

            new FilesystemAdapter($transport)->clear();
        }

        if($this->dispatch === false)
        {
            return null;
        }

        foreach($stamps as $key => $stamp)
        {
            /**
             * Если передана марка MessageDelay - преобразуем её в марку DelayStamp
             */
            if($stamp instanceof MessageDelay)
            {
                if(is_null($this->transport))
                {
                    throw new InvalidArgumentException('Транспорт для отложенного сообщения не установлен');
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
            if($isRunning === false && in_array($transport, ['files-res', 'search']))
            {
                $this->logger->critical(sprintf('Обязательный MessengerTransport %s не найден', $transport));
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
             *
             * @note транспорт UID является профильным
             */
            if($transportRequire)
            {
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
        $transport = trim(str_replace('-low', '', $this->transport));
        return (bool) preg_match('{^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$}Di', $transport);
    }

    /**
     * Делаем пинг на указанный транспорт
     */
    public function isConsumer(?string $transport = null): bool
    {
        if(is_null($this->transport) && is_null($transport))
        {
            return false;
        }

        /** Переопределяем транспорт, если передан в качестве аргумента */

        if(false === is_null($transport))
        {
            $this->transport = $transport;
        }

        $cache = $this->cache->init(self::CONSUMER_NAMESPACE);


        /**
         * Если транспорт LOW и воркер модуля не запущен - передаем его в транспорт async-low
         */
        if(str_contains($this->transport, '-low'))
        {
            $cacheConsume = $cache->getItem('consume-'.$this->HOST.'-'.trim(str_replace('-low', '', $this->transport)));

            /** Если указанный транспорт не запущен - присваиваем транспорт async-low */
            if(false === $cacheConsume->isHit() || (true === $cacheConsume->isHit() && false === $cacheConsume->get()))
            {
                /**
                 * Если транспорт профиля - не отправляем в ASYNC
                 * основное требование - всегда должен быть запущен!!!
                 */
                if($this->isUid())
                {
                    return false;
                }

                $this->transport = 'async-low';
            }

            return true;
        }

        $cacheConsume = $cache->getItem('consume-'.$this->HOST.'-'.trim($this->transport));

        if($cacheConsume->isHit())
        {
            return $cacheConsume->get();
        }

        return false;
    }

    /**
     * Метод запрещает вызов отправлять сообщение в очередь (например в тестовом окружении)
     */
    public function falseDispatch(): void
    {
        $this->dispatch = false;
    }

    /**
     * При вызове диспетчера сообщения - можно передать особый модуль (отличающийся от сообщения) для сброса кеша
     */
    public function addClearCacheOther(string $module): self
    {
        /* Чистим кеш модуля (транспорта) */
        $cache = $this->cache->init($module);
        $cache->clear();

        return $this;
    }
}
