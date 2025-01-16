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

use BaksDev\Core\Twig\CspNonceGenerator;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\ResponseEvent;

#[AsEventListener(event: ResponseEvent::class)]
final readonly class CspNonceListener
{
    public function __construct(
        #[Autowire(env: 'APP_ENV')] private string $environment,
        private CspNonceGenerator $CspNonceGenerator,
        #[Autowire(env: 'HOST')] private ?string $HOST,
        #[Autowire(env: 'CDN_HOST')] private ?string $CDN_HOST,
    ) {}

    /** Создает правила Content-Security-Policy */
    public function onKernelResponse(ResponseEvent $event)
    {
        $response = $event->getResponse();
        $nonce = $this->CspNonceGenerator->getNonce();

        $domains = [
            'yandex.ru',
            '*.yandex.com',
            '*.yandex.ru',
            $this->HOST,
            $this->CDN_HOST,
        ];

        $strict = implode(' ', $domains);

        $cspHeader = "
            connect-src 'self' wss: 'nonce-".$nonce."' ".$strict.";
            
            child-src 'self' blob: ".$strict.";
            frame-src 'self' blob: ".$strict.";
            
            script-src 'nonce-".$nonce."' 'strict-dynamic'".('dev' === $this->environment ? " 'unsafe-eval'" : '').";

            img-src 'self' data: 'nonce-".$nonce."' ".$strict.";
            
            object-src 'none';
            base-uri 'none';
        ";

        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Content-Security-Policy', str_replace(PHP_EOL, '', $cspHeader));
    }
}