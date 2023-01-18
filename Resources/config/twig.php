<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use App\System\Type\Field\FieldExtension;
use App\System\Type\Ip\IpExtension;
use App\System\Type\Measurement\MeasurementExtension;
use App\System\Type\Modify\ModifyExtension;
use App\System\Type\Money\MoneyExtension;
use App\System\Type\Reference\ReferenceExtension;
use Symfony\Config\TwigConfig;

return static function (ContainerConfigurator $configurator, TwigConfig $config)
{
    
    
    
    $services = $configurator->services()
      ->defaults()
      ->autowire()      // Automatically injects dependencies in your services.
      ->autoconfigure() // Automatically registers your services as commands, event subscribers, etc.
    ;
    
    
    /** Twig Extension */
    $services->set('user.ip.type.twig.extension')
      ->class(IpExtension::class)
      ->tag('twig.extension');
    
    /** ModifyExtension */
    $config->path('%kernel.project_dir%/src/System/Type/Modify', 'ModifyAction');
    $services->set('modify.action.type.twig.extension')
      ->class(ModifyExtension::class)
      ->tag('twig.extension');
    
    /** FieldExtension */
    $services->set('field.type.twig.extension')
      ->class(FieldExtension::class)
      ->tag('twig.extension');
    
    
    /** MoneyExtension */
    $services->set('money.type.twig.extension')
      ->class(MoneyExtension::class)
      ->tag('twig.extension');
    
    
        /** SizeClothingExtension */
    $services->set('measurement.type.twig.extension')
      ->class(MeasurementExtension::class)
      ->tag('twig.extension')
    ;
    
    
    $services->set('money.type.twig.extension')
      ->class(MoneyExtension::class)
      ->tag('twig.extension');
    
    
    /** SizeClothingExtension */
    $services->set('reference.type.twig.extension')
      ->class(ReferenceExtension::class)
      ->tag('twig.extension')
    ;
    
    
    $config->global('MAPS_YANDEX_API')->value('%env(MAPS_YANDEX_API)%');
    $config->path('%kernel.project_dir%/src/System/Resources/view', 'System');
    $config->path('%kernel.project_dir%/src/System/Type/Field/templates', 'Field');

};




