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

namespace BaksDev\Core\Listeners\Event;

use BaksDev\Core\Cache\AppCacheInterface;
use DateInterval;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Contracts\Cache\ItemInterface;
use Twig\Environment;

#[AsEventListener(event: RequestEvent::class, priority: 990)]
final readonly class SettingsDeviceListener
{
    public function __construct(
        private Environment $twig,
        private AppCacheInterface $cache
    ) {}

    /** Событие определяет браузер пользователя */
    public function onKernelRequest(RequestEvent $event): void
    {
        $agent = $event->getRequest()->headers->get('User-Agent');

        $device = 'pc';

        if($agent)
        {
            $AppCache = $this->cache->init('core');

            $device = $AppCache->get(md5($agent), function (ItemInterface $item) use ($agent) {

                $item->expiresAfter(DateInterval::createFromDateString('1 day'));

                $browscap = ini_get('browscap') ? get_browser($agent) : null;

                $device = 'pc';

                if($browscap?->ismobiledevice)
                {
                    $device = 'mobile';

                    if($browscap->istablet)
                    {
                        /** TODO: */
                        // $device = 'tablet';
                        $device = 'pc';
                    }
                }

                return $device;
            });

            if(empty($device) || !in_array($device, ['pc', 'mobile', 'tablet']))
            {
                $device = 'pc';
            }
        }

        $event->getRequest()->headers->set('x-device', $device);

        $globals = $this->twig->getGlobals();
        $baks_settings = $globals['baks_settings'] ?? [];
        $this->twig->addGlobal('baks_settings', array_replace_recursive($baks_settings, ['device' => $device]));
    }
}
