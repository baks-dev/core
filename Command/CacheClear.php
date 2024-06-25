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

use BaksDev\Centrifugo\BaksDevCentrifugoBundle;
use BaksDev\Core\Cache\AppCacheInterface;
use BaksDev\Nginx\Unit\BaksDevNginxUnitBundle;
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
use Symfony\Component\Filesystem\Filesystem;

// the name of the command is what users type after "php bin/console"
#[AsCommand(name: 'baks:cache:clear')]
class CacheClear extends Command
{
    public function __construct(
        #[Autowire('%kernel.project_dir%')]
        private readonly string $project_dir,
        private readonly AppCacheInterface $appCache,
        private readonly Filesystem $filesystem
    ) {
        parent::__construct();
    }


    protected function configure(): void
    {
        $this->addArgument('module', InputArgument::OPTIONAL, 'Модуль');
    }

    protected function execute(
        InputInterface $input,
        OutputInterface $output
    ): int {
        $module = $input->getArgument('module');

        $path = implode(DIRECTORY_SEPARATOR, [$this->project_dir, 'vendor', 'baks-dev', null]);

        $io = new SymfonyStyle($input, $output);


        if($module)
        {
            /**
             * Сбрасываем кеш только указанного модуля
             */
            if(is_dir($path.$module))
            {
                $this->clearModule($module);
                $io->success(sprintf('Кеш модуля %s успешно удален', mb_strtoupper($module)));

                return Command::SUCCESS;
            }
        }
        else
        {

            /**
             * Сбрасываем кеш всех модулей
             * @var DirectoryIterator $module
             */
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


        $path = implode(DIRECTORY_SEPARATOR, [$this->project_dir, 'var', 'cache', null]);


        /**
         * Сбрасываем только кеш шаблонов
         */
        if($module === 'template' || $module === 'twig')
        {
            $origin = $path.implode(DIRECTORY_SEPARATOR, ['prod', 'twig']);

            if(is_dir($origin))
            {
                $target = $origin.'_'.time();

                /** Удаляем директорию при завершении работы */
                register_shutdown_function(function () use ($origin, $target) {
                    $this->filesystem->rename($origin, $target);
                    $this->filesystem->remove($target);
                }, 'throw');
            }

            $io->success('Кеш шаблонов успешно удален');
            return Command::SUCCESS;
        }


        /**
         * Полностью удаляем кеш
         * @var DirectoryIterator $cache
         */
        foreach(new DirectoryIterator($path) as $cache)
        {
            if($cache->isDot())
            {
                continue;
            }

            $origin = $cache->getRealPath();
            $target = $cache->getRealPath().'_'.time();

            /** Запускаем асинхронную команду на удаление директории  */
            register_shutdown_function(function () use ($origin, $target) {

                $this->filesystem->rename($origin, $target);
                $this->filesystem->remove($target);

            }, 'throw');

        }


        $io->warning('Рекомендуется выполнить комманду:');

        $io->text('sudo -u unit php bin/console cache:warmup');


        if(class_exists(BaksDevNginxUnitBundle::class))
        {
            $io->text('sudo service unit restart');
        }

        if(class_exists(BaksDevCentrifugoBundle::class))
        {
            $io->text('sudo service centrifugo restart');
            $io->text('');
        }

        $io->text(PHP_EOL);

        return Command::SUCCESS;
    }


    public function clearModule(
        string $module
    ): void {

        /** Сбрасываем кеш адаптера AppCache */
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
