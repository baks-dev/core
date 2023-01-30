<?php

declare(strict_types=1);

namespace BaksDev\Core\Twig\RouteExists;

use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouterInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

final class RouteExistsExtension extends AbstractExtension
{
	
	private RouterInterface $route;
	
	
	public function __construct(RouterInterface $route)
	{
		$this->route = $route;
	}
	
	
	public function getFunctions() : array
	{
		return [
			new TwigFunction('exist_path', $this->exist(...)),
		
		];
	}
	
	
	public function exist(string $name) : bool
	{
		try
		{
			$this->route->generate($name);
			
			return true;
		}
		catch(RouteNotFoundException $e)
		{
			return false;
		}
		
		//return $this->route->getRouteCollection()->get($name) ? true : false;
	}
	
}