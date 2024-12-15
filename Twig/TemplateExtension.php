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

namespace BaksDev\Core\Twig;

use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

final class TemplateExtension extends AbstractExtension
{
    public function __construct(private readonly ParameterBagInterface $parameter) {}


    public function getFunctions(): array
    {
        return [
            new TwigFunction('Template', $this->extends(...)),
        ];
    }

    /**
     * Функция определяет, имеется ли базовый пользовательский шаблон в директории template/Template
     * если не указан вторым аргументом модуль - присваивается core, иначе подключается указанный
     */
    public function extends(string $string): string
    {
        /** @example  @core:user/base.html.twig */
        if(strpos($string, ':'))
        {
            $module = strtok($string, '@:');
            $string = str_replace('@'.$module.':', '/', $string);
        }

        /** @example  @core/user/base.html.twig */
        if(str_starts_with($string, '@'))
        {
            $module = strtok($string, '@/');
            $string = str_replace('@'.$module.'/', '', $string);
        }

        /** Если переопределен шаблон модуля в директории templates */
        if(isset($module) && file_exists($this->parameter->get('kernel.project_dir').'/templates/'.$module.'/'.$string))
        {
            return '@Template/'.$module.'/'.$string;
        }

        /** Если модуль не определен и имеется шаблон в директории templates/Template */
        if(file_exists($this->parameter->get('kernel.project_dir').'/templates/Template/'.$string))
        {
            return '@Template/Template/'.$string;
        }

        return (isset($module) ? '@'.$module.'/' : '@core/').$string;
    }
}
