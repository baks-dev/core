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

use ArrayIterator;
use DirectoryIterator;
use RegexIterator;
use Symfony\Component\Config\Definition\Configurator\DefinitionConfigurator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symfony\Component\HttpKernel\Bundle\AbstractBundle;

class BaksDevCoreBundle extends AbstractBundle
{
    public const string NAMESPACE = __NAMESPACE__.'\\';

    public const string PATH = __DIR__.DIRECTORY_SEPARATOR;

    private ArrayIterator $configs;

    public function prependExtension(ContainerConfigurator $container, ContainerBuilder $builder): void
    {
        $this->configs = new ArrayIterator();

        /** Получаем корневую директорию модулей для поиска файлов конфигурации */
        $parentDirectory = dirname(rtrim(self::PATH, '/'));
        $this->searchResources($parentDirectory);


        /** Получаем директорию SRC */
        $src = $builder->getParameter('kernel.project_dir').DIRECTORY_SEPARATOR.'src';
        $this->searchResources($src);


        /**
         * Импортируем конфиги
         */

        foreach($this->configs as $path)
        {
            $services = new RegexIterator(new DirectoryIterator($path), '/\.php$/');

            foreach($services as $service)
            {
                if($service->isDot() || $service->isDir() || $service->getFilename() === 'routes.php')
                {
                    continue;
                }

                $container->import($service->getPathname());
            }
        }

    }

    public function configure(DefinitionConfigurator $definition): void
    {
        $rootNode = $definition->rootNode();

        $domainPath = $rootNode->children();

        $domainPath
            ->scalarNode('messenger_transport')
            ->defaultValue('doctrine')
            ->end();
    }


    //    public static function getDeclared(): array
    //    {
    //        return array_filter(
    //            get_declared_classes(),
    //            static function ($className) {
    //                return in_array(LocaleInterface::class, class_implements($className), true);
    //            }
    //        );
    //    }


    /**
     * Метод рекурсивно сканирует директории в поиске папки /Resources/config.
     */
    public function searchResources(string $path): void
    {
        /** @var DirectoryIterator $module */
        foreach(new DirectoryIterator($path) as $module)
        {
            if($module->isDot() || !$module->isDir())
            {
                continue;
            }

            if($module->getFilename() !== 'Resources')
            {
                $this->searchResources($module->getRealPath());
                continue;
            }

            $configDir = $module->getRealPath().DIRECTORY_SEPARATOR.'config';

            if(is_dir($configDir))
            {
                $this->configs->offsetSet($configDir, $configDir);
            }
        }
    }
}
