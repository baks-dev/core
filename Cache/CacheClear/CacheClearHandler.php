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

namespace BaksDev\Core\Cache\CacheClear;

use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;


#[AsMessageHandler(priority: 0)]
final readonly class CacheClearHandler
{
    public function __construct(
        private KernelInterface $kernel,
        private Filesystem $filesystem
    ) {}

    /**
     * Метод чистит и прогревает кеш
     */
    public function __invoke(CacheClearMessage $message): void
    {
        if(false === empty($message->getCache()))
        {
            return;
        }


        $clear = new Application($this->kernel);
        $clear->setAutoExit(false);

        $inputClear = new ArrayInput(['command' => 'cache:clear']);
        $clear->run($inputClear, new NullOutput());


        $projectDir = $this->kernel->getProjectDir();

        $cache = implode(DIRECTORY_SEPARATOR, [$projectDir, 'var', 'cache', null]);
        $this->filesystem->chmod($cache, 0773, recursive: true);
        $this->filesystem->chgrp($cache, 'unit', recursive: true);
        $this->filesystem->chown($cache, 'unit', true);

        $log = implode(DIRECTORY_SEPARATOR, [$projectDir, 'var', 'log', null]);
        $this->filesystem->chmod($log, 0773, recursive: true);
        $this->filesystem->chgrp($log, 'unit', recursive: true);
        $this->filesystem->chown($log, 'unit', true);

        $public = implode(DIRECTORY_SEPARATOR, [$projectDir, 'public', null]);
        $this->filesystem->chmod($public, 0773, recursive: true);
        $this->filesystem->chgrp($public, 'unit', recursive: true);
        $this->filesystem->chown($public, 'unit', true);

    }
}