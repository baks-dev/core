<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use BaksDev\Core\Services\Reference\ReferenceChoice;
//use BaksDev\Core\Services\Reference\ReferenceChoiceColor;
use BaksDev\Core\Services\Reference\ReferenceChoiceInterface;
use BaksDev\Core\Services\Reference\ReferenceChoiceSize;

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
	
	$services->set(ReferenceChoice::class)
		->args([tagged_iterator('baks.reference.choice')])
	;
};
