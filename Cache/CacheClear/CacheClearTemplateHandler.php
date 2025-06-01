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

namespace BaksDev\Core\Cache\CacheClear;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler(priority: 10)]
final readonly class CacheClearTemplateHandler
{
    public function __construct(#[Autowire('%kernel.project_dir%')] private string $project_dir) {}

    /**
     * Метод чистит кеш шаблонов Twig
     */
    public function __invoke(CacheClearMessage $message): void
    {

        if(true === empty($message->getCache()))
        {
            return;
        }

        $module = $message->getCache();

        if($module !== 'template')
        {
            return;
        }

        // Кеш шаблонов сбрасываем только в PROD окружении
        $origin = implode(DIRECTORY_SEPARATOR, [$this->project_dir, 'var', 'cache', 'prod', 'twig']);

        if(is_dir($origin))
        {

            $filesystem = new Filesystem();

            $target = $origin.'_'.time();

            /** Удаляем директорию при завершении работы */
            $filesystem->rename($origin, $target);
            $filesystem->remove($target);

            //opcache_reset();

        }

        // Кеш переводов сбрасываем только в PROD окружении
        $origin = implode(DIRECTORY_SEPARATOR, [$this->project_dir, 'var', 'cache', 'prod', 'translations']);

        if(is_dir($origin))
        {

            $filesystem = new Filesystem();

            $target = $origin.'_'.time();

            /** Удаляем директорию при завершении работы */
            $filesystem->rename($origin, $target);
            $filesystem->remove($target);

            //opcache_reset();

        }



    }
}