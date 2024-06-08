<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use BaksDev\Core\BaksDevCoreBundle;
use BaksDev\Core\Repository\SettingsMain\SettingsMainInterface;
use BaksDev\Core\Repository\SettingsMain\SettingsMainRepository;
use BaksDev\Core\Type\Crypt\CryptKey;
use BaksDev\Core\Type\Crypt\CryptKeyInterface;

return static function(ContainerConfigurator $configurator): void {

    $services = $configurator->services()
        ->defaults()
        ->autowire()
        ->autoconfigure();

    $NAMESPACE = BaksDevCoreBundle::NAMESPACE;
    $PATH = BaksDevCoreBundle::PATH;

    /* Language */
    $services->load($NAMESPACE.'Type\Locale\Locales\\', $PATH.'Type/Locale/Locales');

    /* Device */
    $services->load($NAMESPACE.'Type\Device\Devices\\', $PATH.'Type/Device/Devices');

    /* Модификаторы */
    $services->load($NAMESPACE.'Type\Modify\Modify\\', $PATH.'Type/Modify/Modify');


    /** @see https://symfony.com/doc/current/service_container/autowiring.html#dealing-with-multiple-implementations-of-the-same-type */
    $services->alias(SettingsMainInterface::class, SettingsMainRepository::class);

    $services->alias(CryptKeyInterface::class, CryptKey::class);


};
