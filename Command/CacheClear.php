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

namespace BaksDev\Core\Command;

use BaksDev\Core\Cache\AppCacheInterface;
use DirectoryIterator;
use Symfony\Component\Cache\Adapter\ApcuAdapter;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Process\Process;

// the name of the command is what users type after "php bin/console"
#[AsCommand(name: 'baks:cache:clear')]
class CacheClear extends Command
{
    private string $project_dir;
    private AppCacheInterface $appCache;

    public function __construct(
        #[Autowire('%kernel.project_dir%')] string $project_dir,
        AppCacheInterface $appCache
    )
    {
        parent::__construct();
        $this->project_dir = $project_dir;
        $this->appCache = $appCache;
    }



    protected function configure(): void
    {
        $this->addArgument('module', InputArgument::OPTIONAL, 'Модуль');
    }


    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $module = $input->getArgument('module');

        $path = $this->project_dir.'/vendor/baks-dev';

        if($module)
        {
            $io = new SymfonyStyle($input, $output);

            if(is_dir($path.'/'.$module))
            {
                $this->clearModule($module);
                $io->success(sprintf('Кеш модуля %s успешно удален', mb_strtoupper($module)));

                return Command::SUCCESS;
            }

            $io->error(sprintf('Невозможно определить кеш модуля %s', mb_strtoupper($module)));
            return Command::FAILURE;

        }
        else
        {
            /** @var DirectoryIterator $module */
            foreach(new DirectoryIterator($path) as $module)
            {
                if($module->isDot())
                {
                    continue;
                }

                if($module->isDir())
                {
                    $this->clearModule($module->getFilename());
                }
            }
        }

        $command = ($this->getApplication())->get('cache:clear');
        $command->run($input, $output);

        $path = $this->project_dir.'/var/cache';

        /** @var DirectoryIterator $cache */
        foreach(new DirectoryIterator($path) as $cache)
        {
            if($cache->isDot())
            {
                continue;
            }

            if($cache->isDir())
            {
                $process = Process::fromShellCommandline('rm -rf '.$cache->getRealPath());
                $process->setTimeout(5);
                $process->run();
            }
        }

        return Command::SUCCESS;

    }


    public function clearModule(string $module): void
    {
            $appCache = $this->appCache->init($module);
            $appCache->clear();

            if(function_exists('apcu_enabled') && apcu_enabled())
            {
                $apcuCache = new ApcuAdapter($module);
                $apcuCache->clear();
            }

            $fileCache = new FilesystemAdapter($module);
            $fileCache->clear();
    }

}