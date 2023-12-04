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

namespace BaksDev\Core\Twig;

use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;


final class TemplateExtension extends AbstractExtension
{
	private ParameterBagInterface $parameter;
	
	
	public function __construct(ParameterBagInterface $parameter) {
		
		$this->parameter = $parameter;
	}
	
	
	public function getFunctions(): array
    {
		return [
			new TwigFunction('Template', $this->extends(...)),
		];
	}

    /**
     * Функция определяет, имеется ли базовый пользовательский шаблон в директории template/Template, иначе применяет системный Core
     */
	public function extends($string): string
	{
		if(file_exists($this->parameter->get('kernel.project_dir').'/templates/Template/'.$string))
		{
			return '@Template/Template/'.$string;
		}
		
		return '@core/'.$string;
	}
	
}
