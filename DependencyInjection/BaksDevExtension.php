<?php
/*
 * This file is part of the FreshCentrifugoBundle.
 *
 * (c) Artem Henvald <genvaldartem@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare(strict_types=1);

namespace BaksDev\Auth\Email\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\PhpFileLoader;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;

class BaksDevExtension extends Extension
{
    public function load(array $configs, ContainerBuilder $container): void
    {
		$configuration = new Configuration();
		$this->processConfiguration($configuration, $configs);
		
        $loader = new PhpFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
		
		foreach(new \DirectoryIterator(__DIR__.'/../Resources/config') as $config)
		{
			if($config->isDot())
			{
				continue;
			}

			/* Подключаем все конфиги, кроме routes.php */
			//if($config->isFile() && $config->getFilename() !== 'routes.php')
			//{
				$loader->load($config->getFilename());
			//}
		}
    }
	
}
