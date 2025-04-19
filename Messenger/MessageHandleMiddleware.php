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

namespace BaksDev\Core\Messenger;

use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Target;
use Symfony\Component\Messenger\Envelope;
use Symfony\Component\Messenger\Middleware\MiddlewareInterface;
use Symfony\Component\Messenger\Middleware\StackInterface;
use Symfony\Component\Messenger\Stamp\HandledStamp;
use Throwable;

readonly class MessageHandleMiddleware implements MiddlewareInterface
{
    public function __construct(
        #[Target('messageDispatchLogger')] private LoggerInterface $logger,
    ) {}

    /**
     * Метод сохраняет в лог хендлеры сообщения в порядке вызова
     */
    public function handle(Envelope $envelope, StackInterface $stack): Envelope
    {
        $message = $envelope->getMessage();

        $name = explode('\\', $message::class);
        $name = end($name);

        try
        {
            $envelope = $stack->next()->handle($envelope, $stack);

            $handledStamps = $envelope->all(HandledStamp::class);

            foreach($handledStamps as $handledStamp)
            {
                $this->logger->debug(
                    sprintf('%s: %s', $name, $handledStamp->getHandlerName()),
                    [var_export($message, true)]
                );
            }
        }
        catch(Throwable $exception)
        {
            $this->logger->critical(
                sprintf('%s: %s', $name, $exception->getMessage()),
                [var_export($message, true)]
            );
        }

        return $envelope;
    }
}
