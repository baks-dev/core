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

namespace BaksDev\Core\Messenger\Consumers;

use BaksDev\Core\Cache\AppCacheInterface;
use BaksDev\Core\Messenger\MessageDispatch;
use DateInterval;
use Psr\Log\LoggerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

#[AsMessageHandler]
final readonly class MessengerConsumersHandler
{
    private const COMMAND = 'ps aux | grep php | grep messenger:consume';

    private LoggerInterface $logger;

    public function __construct(
        private AppCacheInterface $cache,
        LoggerInterface $coreLogger
    )
    {
        $this->logger = $coreLogger;
    }

    /** Сохраняем информацию о запущенных воркерах */
    public function __invoke(MessengerConsumersMessage $message): void
    {
        $process = Process::fromShellCommandline(self::COMMAND);
        $process->setTimeout(30);

        try
        {
            $process->mustRun();
        }
        catch(ProcessFailedException $exception)
        {
            $this->logger->critical(sprintf('messenger-consume: %s', $exception->getMessage()), [self::class.':'.__LINE__]);
            return;
        }

        $result = $process->getIterator($process::ITER_SKIP_ERR | $process::ITER_KEEP_OUTPUT)->current();

        if(empty($result))
        {
            $this->logger->critical('messenger-consume: Не возможно определить ни одного запущенного воркера', [self::class.':'.__LINE__]);
            return;
        }

        $result = explode(PHP_EOL, $result);

        $cache = $this->cache->init(MessageDispatch::CONSUMER_NAMESPACE);

        foreach($result as $consumers)
        {
            if(!empty($consumers) && strripos($consumers, 'bin/console') !== false)
            {
                if(preg_match('/messenger:consume (.*?) /', $consumers, $matches))
                {
                    $consumer = $matches[1] ?? null;

                    if(!empty($consumer))
                    {
                        $cacheConsume = $cache->getItem('consume-'.$consumer);
                        $cacheConsume->set(true);
                        $cacheConsume->expiresAfter(DateInterval::createFromDateString('5 minutes'));
                        $cache->save($cacheConsume);
                    }
                }
            }
        }
    }
}