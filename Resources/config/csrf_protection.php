<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Symfony\Config\FrameworkConfig;

return static function (FrameworkConfig $framework) {
    $framework->csrfProtection()
        ->enabled(true)
    ;

//    $framework
//        ->errorController('BaksDev\Core\Controller\Error\ErrorController::error')
//
//    ;

};
