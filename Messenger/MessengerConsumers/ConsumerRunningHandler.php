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

namespace BaksDev\Core\Messenger\MessengerConsumers;

use BaksDev\Core\Cache\AppCacheInterface;
use BaksDev\Core\Deduplicator\DeduplicatorInterface;
use BaksDev\Core\Messenger\MessageDispatch;
use BaksDev\Core\Messenger\MessengerConsumers;
use DateInterval;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler(priority: 0)]
final class ConsumerRunningHandler
{
    private bool $isSystemd = false;

    private bool $isAsync = false;

    private bool $isSchedule = false;

    public function __construct(
        #[Autowire(env: 'HOST')] private readonly string $HOST,
        private readonly AppCacheInterface $cache,
        private readonly MessengerConsumers $MessengerConsumers,
        private readonly LoggerInterface $logger,
        private readonly DeduplicatorInterface $deduplicator
    )
    {
        $deduplicator->namespace('core')->expiresAfter('1 minute');
    }

    public function __invoke(ConsumerRunningMessage $message): void
    {

        $cache = $this->cache->init(MessageDispatch::CONSUMER_NAMESPACE);

        $services = $this->MessengerConsumers->toArray();

        if(false === $services)
        {
            return;
        }

        foreach($services as $service)
        {
            if(empty($service))
            {
                continue;
            }

            $consumers = explode('@', $service);
            $consumer = current($consumers);

            $consumer = str_replace(array('baks-', $this->HOST.'-'), '', $consumer);
            $consumer = trim($consumer);

            if($consumer === 'systemd')
            {
                $this->isSystemd = true;
            }

            if($consumer === 'async')
            {
                $this->isAsync = true;
            }

            if($consumer === 'scheduler')
            {
                $this->isSchedule = true;
            }

            $cacheConsume = $cache->getItem('consume-'.$consumer);
            $cacheConsume->set(true);
            $cacheConsume->expiresAfter(DateInterval::createFromDateString('1 day'));
            $cache->save($cacheConsume);

        }

        $deduplicator = $this->deduplicator->deduplication(['systemd', self::class]);

        if(false === $this->isSystemd && false === $deduplicator->isExecuted())
        {
            $deduplicator->save();
            $this->logger->critical('Воркер Systemd проекта не найден');
        }

        $deduplicator = $this->deduplicator->deduplication(['async', self::class]);

        if(false === $this->isAsync && false === $deduplicator->isExecuted())
        {
            $deduplicator->save();
            $this->logger->critical('Воркер Async проекта не найден');
        }

        $deduplicator = $this->deduplicator->deduplication(['schedule', self::class]);

        if(false === $this->isSchedule && false === $deduplicator->isExecuted())
        {
            $deduplicator->save();
            $this->logger->critical('Воркер Schedule проекта не найден');
        }

    }
}
