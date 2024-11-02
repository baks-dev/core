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

namespace BaksDev\Core\Messenger;

use Exception;
use Generator;
use Psr\Log\LoggerInterface;
use Symfony\Component\Process\Process;

final class MessengerConsumers
{
    private const COMMAND = 'systemctl list-units --type=service  | grep baks | grep active | grep running';

    public function __construct(private readonly LoggerInterface $logger) {}

    public function getServices(): Generator|false
    {
        $process = Process::fromShellCommandline(self::COMMAND);
        $process->setTimeout(60);

        try
        {
            $process->mustRun();
        }
        catch(Exception $exception)
        {
            $this->logger->critical(sprintf('messenger-consume: %s', $exception->getMessage()), [self::class.':'.__LINE__]);

            return false;
        }

        $result = $process->getIterator($process::ITER_SKIP_ERR | $process::ITER_KEEP_OUTPUT)->current();

        if(empty($result))
        {
            /** Если возникла ситуация, что воркер нельзя определить - пробуем перезапустить */
            $this->logger->critical('messenger-consume: Не возможно определить ни одного запущенного воркера. Пробуем перезапустить.', [self::class.':'.__LINE__]);

            return false;
        }

        $services = explode(PHP_EOL, $result);

        foreach($services as $service)
        {
            yield trim($service);
        }
    }

    public function restart(): void
    {
        $services = $this->getServices();

        if(false === $services || false === $services->valid())
        {
            return;
        }

        foreach($services as $service)
        {
            $name = explode('.service', $service);
            $name = current($name);
            $name = trim($name);

            if(empty($name) || $name === 'systemd')
            {
                continue;
            }

            $process = Process::fromShellCommandline(sprintf('systemctl restart %s.service', $name));
            $process->setTimeout(60);
            $process->run();
        }

    }
}