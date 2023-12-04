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
	public const METHOD_COPY = 'copy';
	public const METHOD_ABSOLUTE_SYMLINK = 'absolute symlink';
	
	private Filesystem $filesystem;
	
	private string $projectDir;
	
	public function __construct(
        Filesystem $filesystem,
        KernelInterface $kernel
    )
	{
		parent::__construct();
		
		$this->filesystem = $filesystem;
		$this->projectDir = $kernel->getProjectDir();
	}
	
	
//	protected function configure()
//	{
//		$this
//			->setDefinition([
//				new InputArgument('target', InputArgument::OPTIONAL, 'The target directory', null),
//			])
//			->addOption('symlink', null, InputOption::VALUE_NONE, 'Symlink the assets instead of copying them')
//			->addOption('relative', null, InputOption::VALUE_NONE, 'Make relative symlinks')
//			->addOption(
//				'no-cleanup',
//				null,
//				InputOption::VALUE_NONE,
//				'Do not remove the assets of the bundles that no longer exist'
//			)
//		;
//	}
	
	
	protected function execute(InputInterface $input, OutputInterface $output) : int
	{
		$exitCode = 0;
		
		/** @var KernelInterface $kernel */
		$kernel = $this->getApplication()?->getKernel();
		
		$publicDir = $kernel->getProjectDir().DIRECTORY_SEPARATOR.$this->getPublicDirectory($kernel->getContainer());
		
		if(!is_dir($publicDir))
		{
			throw new InvalidArgumentException(sprintf('Каталог "%s" не существует.', $publicDir));
		}
		
		$bundlesDir = $publicDir.DIRECTORY_SEPARATOR.'assets'.DIRECTORY_SEPARATOR;
		
		/* Получаем все имеющиеся папки с ресурсами ASSET */
		$ModuleAssets = $this->searchResources($kernel->getProjectDir().DIRECTORY_SEPARATOR.'src') ?: [];
		$ModuleAssets = array_merge($ModuleAssets,
			$this->searchResources($kernel->getProjectDir().DIRECTORY_SEPARATOR.'vendor/baks-dev')
		);
		
		$io = new SymfonyStyle($input, $output);
		$io->newLine();
		
		$io->text('Установка ресурсов как <info>symbolic links</info>.');
		$io->newLine();


        $validAssetDirs = null;
        $rows = null;

		foreach($ModuleAssets as $moduleAsset)
		{
			/* Проходим паапку assets */
			foreach(new DirectoryIterator($moduleAsset) as $fileInfo)
			{
				/* добавляем симлинки только на паапки */
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
					$this->filesystem->remove($targetDir);
					
					$method = $this->absoluteSymlinkWithFallback($originDir, $targetDir);
					
					//if($method === self::METHOD_ABSOLUTE_SYMLINK)
					//{
					$rows[] = [
						sprintf(
							'<fg=green;options=bold>%s</>',
							'\\' === DIRECTORY_SEPARATOR ? 'OK' : "\xE2\x9C\x94" /* HEAVY CHECK MARK (U+2714) */
						),
						$message,
						$method,
					];
					//                    }
					//                    else
					//                    {
					//                        $rows[] = [
					//                          sprintf(
					//                            '<fg=yellow;options=bold>%s</>',
					//                            '\\' === \DIRECTORY_SEPARATOR ? 'WARNING' : '!'),
					//                          $message,
					//                          $method
					//                        ];
					//                    }
					
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
				//}
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
		
		if($rows)
		{
			$io->table(['', 'Module', 'Method / Error'], $rows);
		}
		
		if(0 !== $exitCode)
		{
			$io->error('При установке активов произошли некоторые ошибки.');
		}
		else
		{
			$io->success($rows ? 'Все ресурсы были успешно установлены.' : 'Нет ресурсов для установки.');
		}
		
		return $exitCode;
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
	 * Try to create absolute symlink.
	 *
	 * Falling back to hard copy.
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
			// fall back to copy
			$method = $this->hardCopy($originDir, $targetDir);
		}
		
		return $method;
	}
	
	
	/**
	 * Метод рекурсивно сканирует директории в поиске папки /Resources/assets
	 *
	 * @param string $path
	 *
	 * @return array|null
	 */
	public function searchResources(string $path) : ?array
	{
		$configs = null;
		
		foreach(new DirectoryIterator($path) as $module)
		{
			if($module->isDot() || !$module->isDir())
			{
				continue;
			}
			
			if(is_dir($module->getRealPath().'/Resources/assets'))
			{
				$configs[] = $module->getRealPath().'/Resources/assets';
				continue;
			}
			
			$config = self::searchResources($module->getRealPath());
			
			if($config !== null)
			{
				$configs = $configs ? array_merge($configs, $config) : $config;
			}
			
		}
		
		return $configs;
	}
	
	
	/**
	 * Creates symbolic link.
	 *
	 * @throws IOException if link cannot be created
	 */
	private function symlink(string $originDir, string $targetDir) : void
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
	 * Copies origin to target.
	 */
	private function hardCopy(string $originDir, string $targetDir): string
	{
		$this->filesystem->mkdir($targetDir, 0777);
		// We use a custom iterator to ignore VCS files
		$this->filesystem->mirror($originDir, $targetDir, Finder::create()->ignoreDotFiles(false)->in($originDir));
		
		return self::METHOD_COPY;
	}
	
}
