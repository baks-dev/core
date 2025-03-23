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

namespace BaksDev\Core\Listeners\Event;

use BaksDev\Core\Cache\AppCacheInterface;
use DateInterval;
use Symfony\Component\DependencyInjection\Attribute\When;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Contracts\Cache\CacheInterface;

#[When(env: 'prod')]
#[AsEventListener(event: KernelEvents::REQUEST, priority: 4096)]
final readonly class ClientBlockListener
{
    /** Количество допустимых соединений с одного IP */
    private const int LIMIT = 10;

    private CacheInterface $cache;

    public function __construct(AppCacheInterface $appCache)
    {
        $this->cache = $appCache->init('request');
    }

    /**
     * Если IP пользователя заблокирован - возвращаем статус «429: Too Many Requests»
     */
    public function onKernelRequest(RequestEvent $event): void
    {
        if($event->getRequest()->isMethod('POST'))
        {
            return;
        }

        $ip = $event->getRequest()->getClientIp();

        $item = $this->cache->getItem($ip);

        if($item->isHit())
        {
            $event->setResponse(new Response('429: Too Many Requests', status: 429));
        }

        for($i = 1; $i <= self::LIMIT; $i++)
        {
            $item = $this->cache->getItem($ip.$i);

            if(false === $item->isHit())
            {
                $item->expiresAfter(DateInterval::createFromDateString('1 seconds'));
                $item->set(true);
                $this->cache->save($item);
                return;
            }
        }

        /** Если в течении 1-й секунды допущено 10 вызова - блокируем на IP на 5 минут */

        $item = $this->cache->getItem($ip);
        $item->expiresAfter(DateInterval::createFromDateString('5 seconds'));
        $item->set(true);
        $this->cache->save($item);
    }
}
