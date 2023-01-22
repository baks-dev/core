<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use BaksDev\Core\Type\Ip\IpExtension;
use BaksDev\Core\Type\Modify\ModifyExtension;

use Symfony\Config\TwigConfig;

return static function (ContainerConfigurator $configurator, TwigConfig $config)
{
	
    $services = $configurator->services()
      ->defaults()
      ->autowire()      // Automatically injects dependencies in your services.
      ->autoconfigure() // Automatically registers your services as commands, event subscribers, etc.
    ;
	
    /** IpExtension */
    $services->set('user.ip.type.twig.extension')
      ->class(IpExtension::class)
      ->tag('twig.extension');
    
    /** ModifyExtension */
    $config->path(__DIR__.'/../../Type/Modify', 'ModifyAction');
	
    $services->set('modify.action.type.twig.extension')
      ->class(ModifyExtension::class)
      ->tag('twig.extension');
	
	
	/** Path View */
    $config->path(__DIR__.'/../view/', 'Core');
	$config->path('%kernel.project_dir%/templates', 'Template');
	
};




