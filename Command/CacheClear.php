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
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Filesystem\Filesystem;

// the name of the command is what users type after "php bin/console"
#[AsCommand(name: 'baks:cache:clear')]
class CacheClear extends Command
{
    public function __construct(
        #[Autowire('%kernel.project_dir%')] private readonly string $project_dir,
        private readonly AppCacheInterface $appCache,
        private readonly Filesystem $filesystem
    ) {
        parent::__construct();
    }


    protected function configure(): void
    {
        $this->addOption('module', 'm', InputOption::VALUE_OPTIONAL, 'Очистить модуль с вхождением ((--module=... || -m ...))');
        $this->addOption('exclude', 'ex', InputOption::VALUE_OPTIONAL, 'Исключить из очистки модуль ((--exclude=... || -ex ...))');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $path = implode(DIRECTORY_SEPARATOR, [$this->project_dir, 'vendor', 'baks-dev', null]);

        $io = new SymfonyStyle($input, $output);


        $module = $input->getOption('module');
        $exclude = $input->getOption('exclude');

        /**
         * Сбрасываем только кеш шаблонов
         */
        if($module === 'template' || $module === 'twig')
        {
            // Кеш шаблонов сбрасываем только в PROD окружении
            $origin = implode(DIRECTORY_SEPARATOR, [$this->project_dir, 'var', 'cache', 'prod', 'twig']);

            if(is_dir($origin))
            {
                $target = $origin.'_'.time();

                /** Удаляем директорию при завершении работы */
                register_shutdown_function(function () use ($origin, $target) {
                    $this->filesystem->rename($origin, $target);
                    $this->filesystem->remove($target);
                    opcache_reset();
                });
            }


            $io->success('Кеш шаблонов успешно удален');
            return Command::SUCCESS;
        }


        $unknown = true;

        /**
         * Сбрасываем кеш модулей
         * @var DirectoryIterator $moduleDir
         */
        foreach(new DirectoryIterator($path) as $moduleDir)
        {
            if($moduleDir->isDot())
            {
                continue;
            }

            if($moduleDir->isDir())
            {

                if(isset($exclude) && stripos($moduleDir->getFilename(), $exclude) !== false)
                {
                    $io->text(sprintf('- Пропустили кеш модуля %s', $moduleDir->getFilename()));
                    continue;
                }

                // если указан модуль и он имеет вхождение в директорию модуля - удаляем
                if(isset($module) && stripos($moduleDir->getFilename(), $module) === false)
                {
                    continue;
                }

                $unknown = false;

                $result = $this->clearModule($moduleDir->getFilename());

                $output->writeln(sprintf('<info>Сбросили кеш модуля %s</info>', $result));
            }
        }

        if(!empty($module))
        {
            if($unknown)
            {
                /** Сбрасываем кеш c namespace */
                $result = $this->clearModule($module);
                $output->writeln(sprintf('<info>Сбросили кеш c namespace %s</info>', $result));
            }

            $io->success('Кеш модулей успешно удален');
            return Command::SUCCESS;
        }


        // Указываем абсолютный путь к директории кеша
        $path = implode(DIRECTORY_SEPARATOR, [$this->project_dir, 'var', 'cache', null]);

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
                opcache_reset();

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


    public function clearModule(string $module): string
    {
        /** Сбрасываем кеш адаптера AppCache */
        $appCache = $this->appCache->init($module);
        $appCache->clear();

        /** Сбрасываем кеш адаптера AppCache метаданных */
        if(method_exists($this->appCache, 'notRestricted'))
        {
            $appCacheRestricted = $this->appCache
                ->notRestricted()
                ->init($module);
            $appCacheRestricted->clear();
        }

        if(function_exists('apcu_enabled') && apcu_enabled())
        {
            $apcuCache = new ApcuAdapter($module);
            $apcuCache->clear();
        }

        $fileCache = new FilesystemAdapter($module);
        $fileCache->clear();

        return $module;
    }

}
