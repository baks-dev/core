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

namespace BaksDev\Core\Messenger\MessengerConsumers;

use BaksDev\Core\Cache\AppCacheInterface;
use BaksDev\Core\Messenger\MessageDispatch;
use BaksDev\Core\Messenger\MessengerConsumers;
use DateInterval;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler(priority: 0)]
final readonly class ConsumerRunningHandler
{
    public function __construct(
        private AppCacheInterface $cache,
        private MessengerConsumers $MessengerConsumers,
    ) {}

    public function __invoke(ConsumerRunningMessage $message): void
    {
        $cache = $this->cache->init(MessageDispatch::CONSUMER_NAMESPACE);

        $services = $this->MessengerConsumers->getServices();

        if(false === $services || false === $services->valid())
        {
            return;
        }

        foreach($services as $service)
        {
            $name = explode('running', $service);
            $name = end($name);
            $consumer = trim($name);

            if(empty($consumer))
            {
                continue;
            }

            $cacheConsume = $cache->getItem('consume-'.$consumer);
            $cacheConsume->set(true);
            $cacheConsume->expiresAfter(DateInterval::createFromDateString('1 day'));
            $cache->save($cacheConsume);
        }
    }
}
