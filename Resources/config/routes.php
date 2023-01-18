<?php

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

return function (RoutingConfigurator $routes)
{
    /* Контроллер по умолчанию */
    $routes->import('../../Controller', 'annotation')
      ->prefix(\App\System\Type\Locale\Locale::routes())
      ->namePrefix('System:');
    
};