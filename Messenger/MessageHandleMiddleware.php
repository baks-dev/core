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

use Exception;
use Psr\Log\LoggerInterface;
use ReflectionClass;
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

        /** Класс обработчика (Dispatcher) */

        $name = explode('\\', $message::class);
        $name = end($name);

        /**
         * Описываем класс вызова
         */

        $reflection = new ReflectionClass($message);

        $instance = $reflection->getShortName().'(';

        foreach($reflection->getProperties() as $property)
        {
            $value = $property->getValue($message);

            try
            {
                if(is_object($value) && false === method_exists($value, '__toString'))
                {
                    $instance .= sprintf("%s: '%s', ", $property->getName(), var_export($value, true));
                    continue;
                }

                $instance .= sprintf("%s: '%s', ", $property->getName(), $value);
            }
            catch(Exception)
            {
                $instance .= sprintf("%s: '%s', ", $property->getName(), var_export($value, true));
            }
        }

        $instance .= ')';

        /**
         * Сохраняем вызовы в порядке приоритета
         */

        try
        {
            $envelope = $stack->next()->handle($envelope, $stack);
            $handledStamps = $envelope->all(HandledStamp::class);

            foreach($handledStamps as $handledStamp)
            {
                $this->logger->debug(
                    sprintf('%s: %s', $name, $handledStamp->getHandlerName()),
                    [$instance],
                );
            }
        }
        catch(Throwable $exception)
        {
            $this->logger->critical(
                sprintf('%s: %s', $name, $exception->getMessage()),
                [
                    $instance,
                    $exception->getPrevious()?->getFile().':'.$exception->getPrevious()?->getLine(),
                ],
            );
        }

        return $envelope;
    }
}
