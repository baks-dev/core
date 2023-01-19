<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use BaksDev\Core\Twig\RouteExists\RouteExistsExtension;
use BaksDev\Core\Type\Field\FieldExtension;
use BaksDev\Core\Type\Ip\IpExtension;
use BaksDev\Core\Type\Measurement\MeasurementExtension;
use BaksDev\Core\Type\Modify\ModifyExtension;
use BaksDev\Core\Type\Money\MoneyExtension;
use BaksDev\Core\Type\Reference\ReferenceExtension;
use Symfony\Config\TwigConfig;

return static function (ContainerConfigurator $configurator, TwigConfig $config)
{
	
    $services = $configurator->services()
      ->defaults()
      ->autowire()      // Automatically injects dependencies in your services.
      ->autoconfigure() // Automatically registers your services as commands, event subscribers, etc.
    ;
	
	/** Функция проверяет, существует ли указанный роун по имени */
//	$services->set('route.exist.twig.extension')
//		->class(RouteExistsExtension::class)
//		->tag('twig.extension');
	

    /** Twig Extension */
    $services->set('user.ip.type.twig.extension')
      ->class(IpExtension::class)
      ->tag('twig.extension');
    
    /** ModifyExtension */
    $config->path(__DIR__.'/../../Type/Modify', 'ModifyAction');
	
    $services->set('modify.action.type.twig.extension')
      ->class(ModifyExtension::class)
      ->tag('twig.extension');
	
	
	
    $config->path(__DIR__.'/../view/', 'Core');

	$config->path('%kernel.project_dir%/templates', 'Template');
	
};




