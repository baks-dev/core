<?php

/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace BaksDev\Core\Command;

use Symfony\Bundle\FrameworkBundle\Console\Helper\DescriptorHelper;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Completion\CompletionInput;
use Symfony\Component\Console\Completion\CompletionSuggestions;
use Symfony\Component\Console\Exception\InvalidArgumentException;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpKernel\Debug\FileLinkFormatter;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\RouterInterface;

/**
 * Генерируем файл phpstorm.routes.php в корне проекта с роутингами для IDE PhpStorm с префиксами модулей
 * файл необходимо добавить:
 * File | Settings | PHP | Symfony | Routing
 */
#[AsCommand(
	name: 'baks:core:phpstorm',
	description: 'Генерирует массив роутингов для интеграции PhpStorm')
]
class RouterPhpstormCommand extends Command
{
	private $router;

	private KernelInterface $kernel;
	
	private Filesystem $filesystem;
	
	
	public function __construct(
		RouterInterface $router,
		KernelInterface $kernel,
		Filesystem $filesystem,
	)
	{
		parent::__construct();
		$this->router = $router;
		$this->kernel = $kernel;
		$this->filesystem = $filesystem;
	}
	
	
//	/**
//	 * {@inheritdoc}
//	 */
//	protected function configure() {}
	
	

	protected function execute(InputInterface $input, OutputInterface $output) : int
	{
		$io = new SymfonyStyle($input, $output);
		$routes = $this->router->getRouteCollection();
		
		$fileName = $this->kernel->getProjectDir().DIRECTORY_SEPARATOR.'phpstorm.routes.php';
		
		$this->filesystem->dumpFile($fileName, "<?php \r\n");
		$this->filesystem->appendToFile($fileName, "return [ \r\n");

		foreach($routes as $route)
		{
			$def = $route->getDefaults();
			
			if(isset($def["_canonical_route"]))
			{
				if($def["_locale"] != "ru")
				{
					continue;
				}
				
				$explode = explode('.', $def["_canonical_route"]);
				if(end($explode) == "css" || end($explode) == "js")
				{
					continue;
				}
				
				$this->filesystem->appendToFile(
					$fileName,
					"\t'".$def["_canonical_route"]."' => [[], ['_controller' => '".quotemeta(
						$def["_controller"]
					)."']], \r\n"
				);
				
			}
			
		}
		
		$this->filesystem->appendToFile($fileName, "];", true);
		
		$io->success('Файл роутинга phpstorm успешно сохранен');
		
		return 0;
	}
	
}
