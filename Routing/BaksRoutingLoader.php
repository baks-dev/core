<?php
/*
 *  Copyright 2024.  Baks.dev <admin@baks.dev>
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

namespace BaksDev\Core\Routing;

use ArrayIterator;
use BaksDev\Core\BaksDevCoreBundle;
use BaksDev\Products\Product\BaksDevProductsProductBundle;
use DirectoryIterator;
use RegexIterator;
use RuntimeException;
use Symfony\Component\Config\Loader\Loader;
use Symfony\Component\Routing\RouteCollection;

final class BaksRoutingLoader extends Loader
{
    private bool $isLoaded = false;

    private ArrayIterator $configs;

    public function load($resource, ?string $type = null): RouteCollection
    {
        if(true === $this->isLoaded)
        {
            throw new RuntimeException('Do not add the "extra" loader twice');
        }

        $this->configs = new ArrayIterator();

        $routes = new RouteCollection();

        /** Получаем корневую директорию для итерации по модулям */
        $parentDirectory = dirname(rtrim(BaksDevCoreBundle::PATH, '/'));
        $this->searchResources($parentDirectory);

        /** Получаем директорию SRC */
        $project = explode('/vendor', BaksDevCoreBundle::PATH);
        $src = current($project).DIRECTORY_SEPARATOR.'src';
        $this->searchResources($src);

        /**
         * Импортируем файлы конфигурации роутинга
         */

        foreach($this->configs as $path)
        {
            $configs = new RegexIterator(new DirectoryIterator($path), '/routes\.php$/');

            /** @var DirectoryIterator $config */

            foreach($configs as $config)
            {
                $importedRoutes = $this->import($config->getRealPath(), 'php');
                $routes->addCollection($importedRoutes);
            }
        }

        $this->isLoaded = true;

        return $routes;
    }


    public function supports($resource, ?string $type = null): bool
    {
        return 'baks' === $type;
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
