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

namespace BaksDev\Core\Messenger\Consumers;

use BaksDev\Core\Cache\AppCacheInterface;
use DateInterval;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Process\Process;

#[AsMessageHandler]
final class MessengerConsumersHandler
{
    private AppCacheInterface $cache;

    public function __construct(AppCacheInterface $cache)
    {
        $this->cache = $cache;
    }

    /** Сохраняем информацию о запущенных воркерах */
    public function __invoke(MessengerConsumersMessage $message): void
    {
        $process = Process::fromShellCommandline('ps aux | grep php | grep messenger:consume');
        $process->setTimeout(1);
        $process->run();

        $result = $process->getIterator($process::ITER_SKIP_ERR | $process::ITER_KEEP_OUTPUT)->current();
        $result = explode(PHP_EOL, $result);

        $cache = $this->cache->init('core');

        foreach($result as $consumers)
        {
            if(!empty($consumers) && strripos($consumers, 'bin/console') !== false)
            {
                if(preg_match('/messenger:consume (.*?) /', $consumers, $matches))
                {
                    $consumer = $matches[1];
                    $cacheConsume = $cache->getItem('consume-'.$consumer);
                    $cacheConsume->expiresAfter(DateInterval::createFromDateString('5 minutes'));
                    $cache->save($cacheConsume);
                }
            }
        }
    }
}