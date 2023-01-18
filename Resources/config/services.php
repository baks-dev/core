<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use App\System\Helper\Switcher\Switcher;

return static function (ContainerConfigurator $configurator) {
    $services = $configurator->services()
      ->defaults()
      ->autowire()      // Automatically injects dependencies in your services.
      ->autoconfigure() // Automatically registers your services as commands, event subscribers, etc.
    ;
    
    $services->load('App\System\Controller\\', '../../Controller')
      ->tag('controller.service_arguments');
    
    $services->load('App\System\Twig\\', '../../Twig');

    
    //$services->load('App\System\Repository\\', '../../Repository');
      //->exclude('/*DTO.php')
      //->tag('controller.service_arguments');
    
    
    $services->load('App\System\Form\\', '../../Form')
      ->exclude('../../Form/**/*DTO.php');
      //->tag('controller.service_arguments');
    
    //$services->load('App\System\Handler\\', '../../Handler');
      //->exclude('/*DTO.php')
      //->tag('controller.service_arguments');
    
    
    //$services->load('App\System\DataFixtures\\', '../../DataFixtures')
    //  ->exclude('../../DataFixtures/**/*DTO.php');

    
    
    //$services->load('App\System\Helper\Switcher\\', '../../Helper/Switcher');


   // $services->load('App\System\Services\EntityEvent\\', '../../Services/EntityEvent');
	
	
	$services->load('App\System\Services\\', '../../Services/*');
	
	//$services->set(Uid::class)
	//	->tag('controller.argument_value_resolver', ['priority' => 100]);
    
    //$services->load('App\System\Services\DatabaseSession\\', '../../Services/DatabaseSession');

    

//    $services->set('render.menu.admin')
//      ->class(RenderMenuAdmin::class)
//      ->args([param('$menuAdmin')])->tag('app.admin.menu');
   // [param('mailer_host')]
    
    //$services->load('App\System\Controller\RenderMenuAdmin\\')->arg('$menuAdmin', '!tagged_iterator app.admin.menu');
    
    //$services->set('App/Controller/RenderMenuAdmin')->class(RenderMenuAdmin::class)->args(['$menuAdmin' , '!tagged_iterator app.admin.menu']);
    
//    App\Services\ProviderService:
//        arguments:
//            $providers: !tagged_iterator app.provider
    
    
//    App\HandlerCollection:
//    # inject all services tagged with app.handler as first argument
//    arguments: [!tagged app.handler]
    
//    _instanceof:
//    App\HandlerInterface:
//        tags: ['app.handler']
    
    
    
    
    
    /*    $services->set('app:switcher', Switcher::class)
          ->tag('controller.service_arguments');*/
      //->arg('$projectDir', '%kernel.project_dir%');
    
    
//    $services->set('app:assets:webp', AssetsWebpCommand::class)
//      //->tag('controller.service_arguments')
//      ->arg('$projectDir', '%kernel.project_dir%');

};
