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

namespace BaksDev\Core;

use BaksDev\Core\DependencyInjection\LocalePass;
use BaksDev\Core\Type\Locale\Locales\LocaleInterface;
use DirectoryIterator;
use Symfony\Component\DependencyInjection\Attribute\TaggedIterator;
use Symfony\Component\DependencyInjection\ChildDefinition;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symfony\Component\HttpKernel\Bundle\AbstractBundle;

class BaksDevCoreBundle extends AbstractBundle
{

	public function prependExtension(ContainerConfigurator $container, ContainerBuilder $builder): void
	{

        $builder->registerForAutoconfiguration(LocaleInterface::class)
            ->addTag('baks.locale')
        ;


		$path = __DIR__.'/Resources/config/';
		
		foreach(new DirectoryIterator($path) as $config)
		{
			if($config->isDot() || $config->isDir())
			{
				continue;
			}
			
			if($config->isFile() && $config->getExtension() === 'php' && $config->getFilename() !== 'routes.php')
			{
				$container->import($config->getPathname());
			}
		}
	}


    public static function getDeclared(): array
    {
        return array_filter(
            get_declared_classes(),
            static function($className) {
                return in_array(LocaleInterface::class, class_implements($className), true);
            }
        );
    }
}
