<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

//use App\System\Services\Menu\MenuExtension;
//use App\System\Services\Menu\MenuHandler;

return static function (ContainerConfigurator $configurator) {
    $services = $configurator->services()
      ->defaults()
      ->autowire()      // Automatically injects dependencies in your services.
      ->autoconfigure() // Automatically registers your services as commands, event subscribers, etc.
    ;
    
    //$services->load('App\System\Menu\\', '../../Menu')->tag('app.admin.menu', ['priority' => 10]);
    
//
//    $services->set(MenuHandler::class)
//      ->args(['$handlers' => tagged_iterator('app.admin.menu')])
//    ;
//
//    /** Twig Extension */
//    $services->set('app.menu.twig.extension')
//      ->class(MenuExtension::class)
//      ->tag('twig.extension');
    
};

