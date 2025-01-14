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
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Contracts\Cache\CacheInterface;

#[When(env: 'prod')]
#[AsEventListener(event: KernelEvents::EXCEPTION)]
final class ErrorExceptionListener
{
    /** Количество допустимых ошибок */
    private const int LIMIT = 5;

    private CacheInterface $cache;

    public function __construct(AppCacheInterface $appCache)
    {
        $this->cache = $appCache->init('request');
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $ip = $event->getRequest()->getClientIp();

        for($i = 1; $i <= self::LIMIT; $i++)
        {
            $item = $this->cache->getItem($ip.'-'.$i);

            if(false === $item->isHit())
            {
                $item->expiresAfter(DateInterval::createFromDateString('3 seconds'));
                $item->set(true);
                $this->cache->save($item);
                return;
            }
        }

        /** Если в течении 2-х секунд допущено 5 ошибок вызова - блокируем на IP на 5 минут */

        $item = $this->cache->getItem($ip);
        $item->expiresAfter(DateInterval::createFromDateString('5 minutes'));
        $item->set(true);
        $this->cache->save($item);
    }
}
