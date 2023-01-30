<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

return static function(ContainerConfigurator $configurator) {
	
	$services = $configurator->services()
		->defaults()
		->autowire()
		->autoconfigure()
	;
	
	$namespace = 'BaksDev\Core';
	
	$services->load($namespace.'\Controller\\', __DIR__.'/../../Controller/*')
		->tag('controller.service_arguments')
	;
	
	$services->load($namespace.'\Twig\\', __DIR__.'/../../Twig');
	
	$services->load($namespace.'\Form\\', __DIR__.'/../../Form')
		->exclude(__DIR__.'/../../Form/**/*DTO.php')
	;
	
	$services->load($namespace.'\Services\\', __DIR__.'/../../Services/*');
	
	$services->load($namespace.'\Repository\\', __DIR__.'/../../Repository/*');
	
};
