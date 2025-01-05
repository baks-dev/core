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
