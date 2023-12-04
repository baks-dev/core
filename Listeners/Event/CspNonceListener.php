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

use BaksDev\Core\Twig\CspNonceGenerator;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\ResponseEvent;

#[AsEventListener(event: ResponseEvent::class)]
final class CspNonceListener
{
    private CspNonceGenerator $CspNonceGenerator;

    public function __construct(CspNonceGenerator $CspNonceGenerator)
    {
        $this->CspNonceGenerator = $CspNonceGenerator;
    }

    /*
        default-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src * 'unsafe-inline';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' yandex.ru yastatic.net ajax.googleapis.com *.yandex.net yandex.st code.createjs.com apis.google.com www.gstatic.com www.google.com ssl.gstatic.com www.googletagmanager.com *.facebook.net www.googleadservices.com vk.com st.top100.ru www.google-analytics.com *.yandex.ru *.adfox.ru otclick-adv.ru cdn.otclick-adv.ru *.exist.ru *.exist.parts telegram.org storage.yandexcloud.net www.sravni.ru cdn.jsdelivr.net;
        img-src * 'unsafe-inline' data:;
        font-src * 'unsafe-inline';
        connect-src * 'self' 'unsafe-inline' 'unsafe-eval';
        frame-src 'self' *.exist.ru tc.exist.ru yandex.ru yandex.kz yandex.ua yandex.by *.yandex.ru *.yandex.kz *.yandex.by *.yandex.ua api-maps.yandex.ru suggest-maps.yandex.ru *.maps.yandex.net www.facebook.com staticxx.facebook.com vk.com www.google.com api-maps.yandex.ru www.elcats.ru www.japancats.ru www.youtube.com oauth.telegram.org otclick-adv.ru cdn.otclick-adv.ru www.sravni.ru storage.yandexcloud.net;
   */

    /** Создает правила Content-Security-Policy */
    public function onKernelResponse(ResponseEvent $event)
    {
        $response = $event->getResponse();
        $nonce = $this->CspNonceGenerator->getNonce();

        $cspHeader = "
            connect-src 'self' *.yandex.ru ws:;
            script-src 'self' 'nonce-".$nonce."' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' *.yandex.ru https:;
            object-src 'none';
            frame-src 'self' blob: https:;
            base-uri 'none';
        ";

        $response->headers->set('Content-Security-Policy', str_replace(PHP_EOL, '', $cspHeader));
    }
}
