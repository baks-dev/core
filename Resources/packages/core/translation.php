<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use BaksDev\Core\BaksDevCoreBundle;
use BaksDev\Core\Type\Locale\Locale;
use Symfony\Config\FrameworkConfig;

return static function (FrameworkConfig $config) {

    $config->defaultLocale((string) Locale::default());

    $config->translator()->paths([BaksDevCoreBundle::PATH.'Resources/translations/']);
};
