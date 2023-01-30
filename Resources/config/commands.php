<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use BaksDev\Core\Command\AssetsInstallCommand;
use BaksDev\Core\Command\RouterPhpstormCommand;
use Symfony\Config\TwigConfig;

return static function(ContainerConfigurator $configurator) {
	$services = $configurator->services()
		->defaults()
		->autowire()      // Automatically injects dependencies in your services.
		->autoconfigure() // Automatically registers your services as commands, event subscribers, etc.
	;
	
	$services->set('baks:assets:install', AssetsInstallCommand::class)
		->arg('$projectDir', '%kernel.project_dir%')
	;
	
	$services->set('baks:router.phpstorm', RouterPhpstormCommand::class)
		->tag('controller.service_arguments')
	;
	
};
