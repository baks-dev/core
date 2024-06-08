<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use BaksDev\Core\BaksDevCoreBundle;
use Symfony\Config\TwigConfig;

return static function (TwigConfig $twig) {

    $twig->path('%kernel.project_dir%/templates', 'Template');
    $twig->path('%kernel.project_dir%/src', 'App');

    $twig->path(BaksDevCoreBundle::PATH.'Resources/view', 'core');

};
