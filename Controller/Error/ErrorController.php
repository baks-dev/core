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
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 *
 *
 */

namespace BaksDev\Core\Controller\Error;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\ErrorHandler\ErrorRenderer\ErrorRendererInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class ErrorController
{
    public function error(
        Throwable $exception,
        Request $request,
        #[Autowire(service: 'twig.error_renderer.html')] ErrorRendererInterface $errorRenderer,
        #[Autowire(env: 'ROOT_IP')] string $root = '0.0.0.0',
        #[Autowire(env: 'APP_ENV')] string $env = 'prod',
    ): Response
    {

        if($env === 'dev' && $request->getClientIp() === $root)
        {
            $exception = $errorRenderer->render($exception);
            return new Response($exception->getAsString(), $exception->getStatusCode(), $exception->getHeaders());
        }

        return new Response(status: method_exists('getStatusCode', $exception) ? $exception->getStatusCode() : 404);
    }
}
