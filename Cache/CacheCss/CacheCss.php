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
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\Cache\ItemInterface;
use function preg_match_all;

final class CacheCss implements CacheCssInterface
{
    private ArrayObject $style;

    private AppCacheInterface $cache;

    public function __construct(AppCacheInterface $cache)
    {
        $this->cache = $cache;

        $this->style = new ArrayObject();

        //register_shutdown_function(array ($this, 'assets_css'), 'throw');

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

        $cache = $this->cache->init($module);
        $key = $route.$file.$device.($user ? '.user' : '');

        //$cache->delete($key);

        $styles = $cache->get($key, function(ItemInterface $item) use ($content) {

            $item->expiresAfter(DateInterval::createFromDateString('30 day'));

            //dump('css cache');

            //dd($content);


            // class&#x3D;&quot;
            // &quot;

            //  //"|class=(\"\&#x3D;\&quot;)(.*)(\"\&quot;)|si",


            /* Ищем все теги class="..." */
            preg_match_all(
                "|class=['\"](.*)['\"]|U",
                $content,
                $out,
                PREG_PATTERN_ORDER
            );

            $classes = null;

            foreach($out[1] as $class)
            {

                foreach(explode(' ', $class) as $css_class)
                {
                    if(!empty($css_class))
                    {
                        $classes[$css_class] = $css_class;
                    }
                }
            }

            preg_match_all(

                "|class&#x3D;&quot;(.*)&quot;|U",
                $content,
                $out,
                PREG_PATTERN_ORDER);

            foreach($out[1] as $class)
            {

                $class = str_replace('&#x20;', ' ', $class);

                foreach(explode(' ', $class) as $css_class)
                {
                    if(!empty($css_class))
                    {
                        $classes[$css_class] = $css_class;
                    }
                }
            }


            /* Ищем все теги data-bs-toggle="..." */
            preg_match_all(
                "|data-bs-toggle=['\"](.*)['\"]|U",
                $content,
                $out,
                PREG_PATTERN_ORDER
            );

            //dump(array_unique($out[1]));

            if(!empty($out[1]))
            {
                $classes['fade'] = 'fade';
                $classes['show'] = 'show';
                $classes['active'] = 'active';
            }

            foreach(array_unique($out[1]) as $class)
            {
                $classes[$class] = $class;
            }

            $path = __DIR__.'/../../Resources/assets/css/original.min.css';

            $file = realpath($path);

            $css = file_get_contents($file);
            preg_match_all('/([a-z0-9\s\.\:#_\-@,%\[\]()\'"=*\\>~\/+]+)\{([^\}]*)\}/si', $css, $arr);
            $css = $arr[0];


            foreach($arr[1] as $key => $style)
            {

                foreach($classes as $cls)
                {
                    //dump($style.' - '.$cls);

                    if(stripos($style, $cls) !== false)
                    {

                        //                        dump($cls);
                        //                        dump($style);
                        //                        dump($css[$key]);
                        //                        dd($key);

                        $this->style->offsetSet($key, $css[$key]);
                    }
                }

                //dump($cls);
                //dump($arr[1]);

            }

            return implode('', $this->style->getArrayCopy());
        });



        $content = str_replace('<style></style>', '<style>'.$styles.'</style>', $content);

        return $content;
    }
}