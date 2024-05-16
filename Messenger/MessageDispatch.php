<?php
/*
 *  Copyright 2023.  Baks.dev <admin@baks.dev>
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

use App\Kernel;
use BaksDev\Core\Cache\AppCacheInterface;
use Closure;
use DateInterval;
use Psr\Log\LoggerInterface;
use ReflectionClass;
use ReflectionProperty;
use Symfony\Component\Cache\Adapter\ApcuAdapter;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\TransportNamesStamp;
use Symfony\Component\Process\Process;

final class MessageDispatch implements MessageDispatchInterface
{
    private ?string $transport = null;

    private MessageBusInterface $messageBus;

    private LoggerInterface $logger;

    private AppCacheInterface $cache;

    public function __construct(
        MessageBusInterface $messageBus,
        LoggerInterface $messageDispatchLogger,
        AppCacheInterface $cache
    )
    {
        $this->messageBus = $messageBus;
        $this->logger = $messageDispatchLogger;
        $this->cache = $cache;
    }

    public function dispatch(object $message, array $stamps = [], string $transport = null): mixed
    {
        if($transport)
        {
            $this->transport = $transport;

            /* Чистим кеш модуля (транспорта) */
            $cache = $this->cache->init($transport);
            $cache->clear();
        }

        /**
         * Если указан транспорт - пробуем отправить в очередь
         */

        if($this->transport)
        {
            /* Делаем пинг на указанный транспорт */
            $isRunning = $this->isConsumer();

            /** Транспорт resources всегда должен быть запущен */
            if($transport === 'files-res' && $isRunning === false)
            {
                $this->logger->critical('Messanger Транспорт files-res не найден');
                return false;
            }

            /**
             * Если транспорт запущен - отправляем сообщение в очередь
             */
            if($isRunning)
            {
                return $this->messageBus->dispatch($message, array_merge($stamps, [new TransportNamesStamp([$this->transport])]));
            }

            $transportRequire = $this->isUid(); // транспорт UID

            /** Если транспорт не определяется и он является UID (обязательным) */
            if($isRunning === false && $transportRequire)
            {
                $this->logger->critical(sprintf('Messanger Транспорт %s не найден', $this->transport));
                return false;
            }
        }

        /** Если транспорт не определяется и он не является UID (обязательным) - обрабатываем синхронно */
        return $this->messageBus->dispatch($message, $stamps);
    }

    public function transport(string $transport): self
    {
        $this->transport = $transport;
        return $this;
    }

    public function isUid(): bool
    {
        return (bool) preg_match('{^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$}Di', $this->transport);
    }

    /** Получаем через рефлексию значение свойства */
    private function getPropertyValue(string $property, object $object): mixed
    {
        $modifiers = new ReflectionProperty($object, $property);

        // Если свойство не инициировано - false
        if(!$modifiers->isInitialized($object))
        {
            return false;
        }

        if($modifiers->isStatic())
        {
            $getPropertyEntity = Closure::bind(function($object, $property) {

                if(method_exists($object, $property))
                {
                    return $object::{$property}();
                }

                if(method_exists($object, '__toString'))
                {
                    return (string) $object;
                }

                return 'object';

            }, null, $object);
        }
        else
        {
            if(method_exists($object, '__toString'))
            {
                return (string) $object;
            }

            $getPropertyEntity = Closure::bind(function($object, $property) {
                return $object->{$property};
            }, null, $object);
        }

        return $getPropertyEntity($object, $property);
    }

    public function objectToArray(mixed $object)
    {
        $new = [];

        if(is_object($object))
        {
            if(method_exists($object, '__toString'))
            {
                return (string) $object;
            }

            $ReflectionClass = new ReflectionClass($object);

            foreach($ReflectionClass->getProperties() as $reflectionProperty)
            {
                $propertyName = $reflectionProperty->getName();
                $propertyValue = $this->getPropertyValue($propertyName, $object);
                $new[$propertyName] = $this->objectToArray($propertyValue);
            }

            return $new;
        }

        return $object;
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

        $cache = $this->cache->init('core');
        $cacheConsume = $cache->getItem('consume-'.$this->transport);

        if($cacheConsume->isHit())
        {
            return $cacheConsume->get();
        }

        $process = Process::fromShellCommandline('ps aux | grep php | grep messenger:consume | grep '.$this->transport);
        $process->setTimeout(1);
        $process->run();

        $result = $process->getIterator($process::ITER_SKIP_ERR | $process::ITER_KEEP_OUTPUT)->current();
        $isRunning = (!empty($result) && strripos($result, 'messenger:consume '.$this->transport.' '));

        $cacheConsume->set($isRunning);
        $cacheConsume->expiresAfter(DateInterval::createFromDateString('5 minutes'));
        $cache->save($cacheConsume);

        return $isRunning;
    }
}