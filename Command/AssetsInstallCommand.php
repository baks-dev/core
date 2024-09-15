<?php

namespace BaksDev\Core\Command;

use DirectoryIterator;
use Exception;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Exception\InvalidArgumentException;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Filesystem\Exception\IOException;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpKernel\KernelInterface;

use function dirname;

use const DIRECTORY_SEPARATOR;

#[AsCommand(
    name: 'baks:assets:install',
    description: 'Устанавливает файлы ресурсов в публичную директорию',
)]
class AssetsInstallCommand extends Command
{
    public const string METHOD_COPY = 'copy';
    public const string METHOD_ABSOLUTE_SYMLINK = 'absolute symlink';

    private Filesystem $filesystem;

    private string $projectDir;

    public function __construct(
        Filesystem $filesystem,
        KernelInterface $kernel
    ) {
        parent::__construct();

        $this->filesystem = $filesystem;
        $this->projectDir = $kernel->getProjectDir();
    }


    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->newLine();

        /* ******************************* */

        $io->text('Установка конфигурационных файлов');
        $io->newLine();

        $rows = $this->assetsPackages();

        if($rows)
        {
            $io->table(['', 'Module', 'Method / Error'], $rows);
        }

        /* ******************************* */

        $io->text('Установка файлов роутинга');
        $io->newLine();

        $rows = $this->assetsRouting();

        if($rows)
        {
            $io->table(['', 'Module', 'Method / Error'], $rows);
        }


        /* ******************************* */

        $io->text('Установка файловых ресурсов');
        $io->newLine();

        $rows = $this->assetsFile();

        if($rows)
        {
            $io->table(['', 'Module', 'Method / Error'], $rows);
        }


        return Command::SUCCESS;
    }


    private function assetsFile(): ?array
    {
        /** @var KernelInterface $kernel */
        $kernel = $this->getApplication()?->getKernel();

        $publicDir = $this->projectDir.DIRECTORY_SEPARATOR.$this->getPublicDirectory($kernel->getContainer());

        if(!is_dir($publicDir))
        {
            throw new InvalidArgumentException(sprintf('Каталог "%s" не существует.', $publicDir));
        }

        /* Получаем все имеющиеся папки с ресурсами ASSET */
        $ModuleAssets = $this->searchAssets($this->projectDir.DIRECTORY_SEPARATOR.'src', 'assets') ?: [];

        $ModuleAssets = array_merge(
            $ModuleAssets,
            $this->searchAssets($this->projectDir.implode(DIRECTORY_SEPARATOR, ['', 'vendor', 'baks-dev']), 'assets')
        );

        $validAssetDirs = null;
        $rows = null;

        $bundlesDir = $publicDir.implode(DIRECTORY_SEPARATOR, ['', 'assets', '']);

        foreach($ModuleAssets as $moduleAsset)
        {
            /* Проходим паапку assets */
            foreach(new DirectoryIterator($moduleAsset) as $fileInfo)
            {
                /* добавляем симлинки только на директории */
                if($fileInfo->isDot() || !is_dir($fileInfo->getRealPath()))
                {
                    continue;
                }

                $originDir = $fileInfo->getRealPath();
                $assetDir = mb_strtolower($fileInfo->getFilename());

                $targetDir = $bundlesDir.$assetDir;

                $validAssetDirs[] = $assetDir;
                $message = $fileInfo->getFilename();

                try
                {
                    $this->filesystem->remove($targetDir); // continue;

                    $method = $this->absoluteSymlinkWithFallback($originDir, $targetDir);

                    $rows[] = [
                        sprintf(
                            '<fg=green;options=bold>%s</>',
                            '\\' === DIRECTORY_SEPARATOR ? 'OK' : "\xE2\x9C\x94" /* HEAVY CHECK MARK (U+2714) */
                        ),
                        $message,
                        $method,
                    ];
                }
                catch(Exception $e)
                {
                    $rows[] = [
                        sprintf(
                            '<fg=red;options=bold>%s</>',
                            '\\' === DIRECTORY_SEPARATOR ? 'ERROR' : "\xE2\x9C\x98" /* HEAVY BALLOT X (U+2718) */
                        ),
                        $message,
                        $e->getMessage(),
                    ];
                }
            }
        }

        // удаляем ресурсы, которых больше не существуют
        if(is_dir($bundlesDir))
        {
            $validAssetDirs[] = 'images';
            $validAssetDirs[] = 'video';
            $validAssetDirs[] = 'files';

            $dirsToRemove = Finder::create()->depth(0)->directories()->exclude($validAssetDirs)->in($bundlesDir);

            $this->filesystem->remove($dirsToRemove);
        }

        return $rows;
    }

    private function assetsRouting(): ?array
    {
        $ModuleRoutes = $this->searchAssets($this->projectDir.implode(DIRECTORY_SEPARATOR, ['', 'vendor', 'baks-dev']), 'routes') ?: [];
        $routesDir = $this->projectDir.implode(DIRECTORY_SEPARATOR, ['', 'config', 'routes', 'baks-dev', '']);

        if(!is_dir($routesDir))
        {
            $this->filesystem->mkdir($routesDir);
        }

        $validAssetDirs = null;
        $rows = null;

        foreach($ModuleRoutes as $path)
        {
            foreach(new DirectoryIterator($path) as $fileInfo)
            {
                /* добавляем симлинки только на директории */
                if($fileInfo->isDot() || !is_dir($fileInfo->getRealPath()))
                {
                    if($fileInfo->getFilename() === 'baks-routes.php')
                    {
                        $baksRoutesDir = $this->projectDir.implode(DIRECTORY_SEPARATOR, ['', 'config', 'routes', '']);
                        $this->filesystem->copy($fileInfo->getRealPath(), $baksRoutesDir.'baks-routes.php');
                    }

                    continue;
                }

                $originDir = $fileInfo->getRealPath();
                $routeName = mb_strtolower($fileInfo->getFilename());
                $targetDir = $routesDir.$routeName;

                $validAssetDirs[] = $routeName;
                $message = $fileInfo->getFilename();

                try
                {
                    /** Удаляем директорию с роутингом для обновления */
                    $this->filesystem->remove($targetDir);

                    if(false === $this->filesystem->exists($originDir))
                    {
                        continue;
                    }

                    $method = $this->absoluteSymlinkWithFallback($originDir, $targetDir);

                    $rows[] = [
                        sprintf(
                            '<fg=green;options=bold>%s</>',
                            '\\' === DIRECTORY_SEPARATOR ? 'OK' : "\xE2\x9C\x94"
                        ),
                        $message,
                        $method,
                    ];
                }
                catch(Exception $e)
                {
                    $exitCode = 1;

                    $rows[] = [
                        sprintf(
                            '<fg=red;options=bold>%s</>',
                            '\\' === DIRECTORY_SEPARATOR ? 'ERROR' : "\xE2\x9C\x98" /* HEAVY BALLOT X (U+2718) */
                        ),
                        $message,
                        $e->getMessage(),
                    ];
                }

            }
        }

        // удаляем ресурсы, которых больше не существуют
        if(is_dir($routesDir))
        {
            $dirsToRemove = Finder::create()->depth(0)->directories()->in($routesDir);

            if($validAssetDirs)
            {
                $dirsToRemove->exclude($validAssetDirs);
            }

            $this->filesystem->remove($dirsToRemove);
        }

        return $rows;
    }


    private function assetsPackages(): ?array
    {
        $ModulePackages = $this->searchAssets($this->projectDir.implode(DIRECTORY_SEPARATOR, ['', 'vendor', 'baks-dev']), 'packages') ?: [];
        $packagesDir = $this->projectDir.implode(DIRECTORY_SEPARATOR, ['', 'config', 'packages', 'baks-dev', '']);

        if(!is_dir($packagesDir))
        {
            $this->filesystem->mkdir($packagesDir);
        }

        $validAssetDirs = null;
        $rows = null;

        foreach($ModulePackages as $path)
        {


            foreach(new DirectoryIterator($path) as $fileInfo)
            {
                /* добавляем симлинки только на директории */
                if($fileInfo->isDot() || !is_dir($fileInfo->getRealPath()))
                {
                    continue;
                }

                $originDir = $fileInfo->getRealPath();
                $packageName = mb_strtolower($fileInfo->getFilename());
                $targetDir = $packagesDir.$packageName;

                $validAssetDirs[] = $packageName;
                $message = $fileInfo->getFilename();

                try
                {
                    $this->filesystem->remove($targetDir);

                    if(false === $this->filesystem->exists($originDir))
                    {
                        continue;
                    }

                    $method = $this->absoluteSymlinkWithFallback($originDir, $targetDir);

                    $rows[] = [
                        sprintf(
                            '<fg=green;options=bold>%s</>',
                            '\\' === DIRECTORY_SEPARATOR ? 'OK' : "\xE2\x9C\x94"
                        ),
                        $message,
                        $method,
                    ];
                }
                catch(Exception $e)
                {
                    $rows[] = [
                        sprintf(
                            '<fg=red;options=bold>%s</>',
                            '\\' === DIRECTORY_SEPARATOR ? 'ERROR' : "\xE2\x9C\x98" /* HEAVY BALLOT X (U+2718) */
                        ),
                        $message,
                        $e->getMessage(),
                    ];
                }

            }
        }

        // удаляем ресурсы, которых больше не существуют
        if(is_dir($packagesDir))
        {
            $dirsToRemove = Finder::create()->depth(0)->directories()->in($packagesDir);

            if($validAssetDirs)
            {
                $dirsToRemove->exclude($validAssetDirs);
            }

            $this->filesystem->remove($dirsToRemove);
        }

        return $rows;
    }


    private function getPublicDirectory(ContainerInterface $container): string
    {
        $defaultPublicDir = 'public';

        if(null === $this->projectDir && !$container->hasParameter('kernel.project_dir'))
        {
            return $defaultPublicDir;
        }

        $composerFilePath = ($this->projectDir ?? $container->getParameter('kernel.project_dir')).'/composer.json';

        if(!file_exists($composerFilePath))
        {
            return $defaultPublicDir;
        }

        $composerConfig = json_decode(file_get_contents($composerFilePath), true, 512, JSON_THROW_ON_ERROR);

        return $composerConfig['extra']['public-dir'] ?? $defaultPublicDir;
    }


    /**
     * Попробуйте создать абсолютную символическую ссылку.
     */
    private function absoluteSymlinkWithFallback(string $originDir, string $targetDir): string
    {
        try
        {
            $this->symlink($originDir, $targetDir);
            $method = self::METHOD_ABSOLUTE_SYMLINK;
        }
        catch(IOException $e)
        {
            $method = $this->hardCopy($originDir, $targetDir);
        }

        return $method;
    }


    /**
     * Метод рекурсивно сканирует директории в поиске папки /Resources/assets
     */
    public function searchAssets(string $path, string $dirname = 'assets'): ?array
    {
        $configs = null;

        foreach(new DirectoryIterator($path) as $module)
        {
            if($module->isDot() || !$module->isDir())
            {
                continue;
            }

            if(is_dir($module->getRealPath().'/Resources/'.$dirname))
            {
                $configs[] = $module->getRealPath().'/Resources/'.$dirname;
                continue;
            }

            $config = $this->searchAssets($module->getRealPath());

            if($config !== null)
            {
                $configs = $configs ? array_merge($configs, $config) : $config;
            }

        }

        return $configs;
    }


    /**
     * Создает символическую ссылку
     */
    private function symlink(string $originDir, string $targetDir): void
    {
        $this->filesystem->mkdir(dirname($targetDir));
        $originDir = $this->filesystem->makePathRelative($originDir, realpath(dirname($targetDir)));

        $this->filesystem->symlink($originDir, $targetDir);
        if(!file_exists($targetDir))
        {
            throw new IOException(
                sprintf('Symbolic link "%s" was created but appears to be broken.', $targetDir),
                0,
                null,
                $targetDir
            );
        }
    }


    /**
     * Копирует источник
     */
    private function hardCopy(string $originDir, string $targetDir): string
    {
        $this->filesystem->mkdir($targetDir, 0777);
        // We use a custom iterator to ignore VCS files
        $this->filesystem->mirror($originDir, $targetDir, Finder::create()->ignoreDotFiles(false)->in($originDir));

        return self::METHOD_COPY;
    }

}
