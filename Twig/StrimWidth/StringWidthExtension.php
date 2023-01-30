<?php

namespace BaksDev\Core\Twig\StrimWidth;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

final class StringWidthExtension extends AbstractExtension
{
	public function getFunctions() : array
	{
		return [
			new TwigFunction('string_width', [$this, 'strimwidth']),
		];
	}
	
	
	/** Получение строки, обрезанной до заданного размера */
	public function strimwidth(?string $string, int $width) : ?string
	{
		return empty($string) ? null : \mb_strimwidth($string, 0, $width, "...");
	}
	
}