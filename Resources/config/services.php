<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use BaksDev\Core\Repository\SettingsMain\SettingsMainInterface;
use BaksDev\Core\Repository\SettingsMain\SettingsMainRepository;

return static function (ContainerConfigurator $configurator): void {
    $services = $configurator->services()
        ->defaults()
        ->autowire()
        ->autoconfigure();

    $NAMESPACE = 'BaksDev\Core\\';

    $MODULE = substr(__DIR__, 0, strpos(__DIR__, "Resources"));

    $services->load($NAMESPACE, $MODULE)
        ->exclude([
            $MODULE.'{Entity,Resources,Type}',
            $MODULE.'**/*Message.php',
            $MODULE.'**/*DTO.php',
        ])
    ;

    /* Language */
    $services->load($NAMESPACE.'Type\Locale\Locales\\', $MODULE.'Type/Locale/Locales');

    $services->load($NAMESPACE.'Type\Device\Devices\\', $MODULE.'Type/Device/Devices');

    $services->load($NAMESPACE.'Type\Modify\Modify\\', $MODULE.'Type/Modify/Modify');


    /** @see https://symfony.com/doc/current/service_container/autowiring.html#dealing-with-multiple-implementations-of-the-same-type */
    $services->alias(SettingsMainInterface::class, SettingsMainRepository::class);

};
