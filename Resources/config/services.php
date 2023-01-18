<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;


return static function (ContainerConfigurator $configurator) {
	
    $services = $configurator->services()
      ->defaults()
      ->autowire()
      ->autoconfigure()
    ;
    
    $services->load('BaksDev\Core\Controller\\', __DIR__.'/../../Controller')
      ->tag('controller.service_arguments');
    
    $services->load('BaksDev\Core\Twig\\', __DIR__.'/../../Twig');
	
    $services->load('BaksDev\Core\Form\\', __DIR__.'/../../Form')
      ->exclude(__DIR__.'/../../Form/**/*DTO.php');
	
	$services->load('BaksDev\Core\Services\\', __DIR__.'/../../Services/*');
	

};
