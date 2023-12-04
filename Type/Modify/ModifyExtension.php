<?php

namespace BaksDev\Core\Type\Modify;

use Twig\Environment;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

final class ModifyExtension extends AbstractExtension
{
	public function getFunctions() : array
	{
		return [
			new TwigFunction('modify_action',
				[$this, 'modify_action'],
				['needs_environment' => true, 'is_safe' => ['html']]
			),
		];
	}
	
	public function modify_action(Environment $twig, string $action): string
	{
		return $twig->render('@ModifyAction/modify.html.twig', ['action' => 'modify.'.$action]);
	}
	
}