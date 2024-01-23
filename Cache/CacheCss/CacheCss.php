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

namespace BaksDev\Core\Cache\CacheCss;

use ArrayObject;
use BaksDev\Core\Cache\AppCacheInterface;
use DateInterval;
use DOMDocument;
use DOMElement;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\Cache\ItemInterface;
use function libxml_use_internal_errors;
use function preg_match_all;

final class CacheCss implements CacheCssInterface
{
    private ArrayObject $style;

    private AppCacheInterface $cache;
    private string $env;

    public function __construct(
        AppCacheInterface $cache,
        #[Autowire(env: 'APP_ENV')] string $env = 'prod',
    )
    {
        $this->cache = $cache;

        $this->style = new ArrayObject();

        //register_shutdown_function(array ($this, 'assets_css'), 'throw');

        $this->env = $env;
    }

    public function getStyle(
        string $file,
        string $content,
        string $module,
        string $route,
        string $device,
        bool $user
    ): string
    {

        dd(4654654);

        $cache = $this->cache->init($module);
        $key = $route.$file.$device.($user ? '.user' : '');

        if($this->env === 'dev')
        {
            $cache->delete($key);
        }

        $styles = $cache->get($key, function(ItemInterface $item) use ($content) {

            $item->expiresAfter(DateInterval::createFromDateString('30 day'));

            $classes = $this->getHtmlClass($content);

            $path = __DIR__.'/../../Resources/assets/css/style.min.css';

            $file = realpath($path);

            $css = file_get_contents($file);
            preg_match_all('/([a-z0-9\s\.\:#_\-@,%\[\]()\'"=*\\>~\/+]+)\{([^\}]*)\}/si', $css, $arr);
            $css = $arr[0];

            foreach($arr[1] as $key => $style)
            {
                foreach($classes as $cls)
                {
                    if($cls && stripos($style, '.'.$cls) !== false)
                    {
                        $this->style->offsetSet($key, $css[$key]);
                    }
                }
            }

            return implode('', $this->style->getArrayCopy());
        });


        $content = str_replace('<style></style>', '<style>'.$styles.'</style>', $content);

        return $content;
    }


    private function getHtmlTags($html)
    {
        preg_match_all('/<([a-z]+)[^>]*>/i', $html, $matches);
        $tags = array_unique($matches[1]);
        sort($tags);
        return $tags;
    }

    private function getHtmlClass($html)
    {

        $dom = new DOMDocument('1.0', 'UTF-8');
        libxml_use_internal_errors(true);
        $dom->loadHTML($html);
        //\libxml_use_internal_errors($internalErrors);

        $classes = [];
        $tags = [];

        $tagsElements = $dom->getElementsByTagName('*');


        /** @var DOMElement $tag */
        foreach($tagsElements as $tag)
        {
            $tags[$tag->nodeName] = $tag->nodeName;

            $class = $tag->getAttribute('class');

            if(!empty($class))
            {
                $classArray = explode(' ', $class);

                foreach($classArray as $add)
                {
                    $classes[$add] = $add;
                }
            }

            $bs = $tag->getAttribute('data-bs-toggle');

            if(!empty($bs))
            {
                $classes[$bs] = $bs;
                $classes['fade'] = 'fade';
                $classes['show'] = 'show';
                $classes['active'] = 'active';
            }

        }

        //$classes = array_unique($classes);
        //sort($classes);

        return $classes;
    }
}