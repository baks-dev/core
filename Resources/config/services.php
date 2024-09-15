<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use BaksDev\Core\BaksDevCoreBundle;
use BaksDev\Core\Repository\SettingsMain\SettingsMainInterface;
use BaksDev\Core\Repository\SettingsMain\SettingsMainRepository;
use BaksDev\Core\Routing\BaksRoutingLoader;
use BaksDev\Core\Type\Crypt\CryptKey;
use BaksDev\Core\Type\Crypt\CryptKeyInterface;

return static function (ContainerConfigurator $container): void {

    //    $services = $container->services()
    //        ->defaults()
    //        ->autowire()
    //        ->autoconfigure();
    //
    //    $NAMESPACE = $NAMESPACE;
    //    $PATH = $PATH;
    //
    //    /* Language */
    //    $services->load($NAMESPACE.'Type\Locale\Locales\\', $PATH.'Type/Locale/Locales');
    //
    //    /* Device */
    //    $services->load($NAMESPACE.'Type\Device\Devices\\', $PATH.'Type/Device/Devices');
    //
    //    /* Модификаторы */
    //    $services->load($NAMESPACE.'Type\Modify\Modify\\', $PATH.'Type/Modify/Modify');
    //
    //
    //    /** @see https://symfony.com/doc/current/service_container/autowiring.html#dealing-with-multiple-implementations-of-the-same-type */
    //    $services->alias(SettingsMainInterface::class, SettingsMainRepository::class);
    //
    //    $services->alias(CryptKeyInterface::class, CryptKey::class);


    $services = $container->services()
        ->defaults()
        ->autowire()
        ->autoconfigure();

    $NAMESPACE = BaksDevCoreBundle::NAMESPACE;
    $PATH = BaksDevCoreBundle::PATH;

    $services->load($NAMESPACE, $PATH)
        ->exclude([
            $PATH.'{Entity,Resources,Type}',
            $PATH.'**'.DIRECTORY_SEPARATOR.'*Message.php',
            $PATH.'**'.DIRECTORY_SEPARATOR.'*DTO.php',
            $PATH.'**'.DIRECTORY_SEPARATOR.'*Test.php',
            // $PATH.'**'.DIRECTORY_SEPARATOR.'regions.php',
        ]);


    /* Language */
    $services->load(
        $NAMESPACE.'Type\Locale\Locales\\',
        $PATH.implode(DIRECTORY_SEPARATOR, ['Type', 'Locale', 'Locales']) // 'Type/Locale/Locales'
    );

    /* Device */
    $services->load(
        $NAMESPACE.'Type\Device\Devices\\',
        $PATH.implode(DIRECTORY_SEPARATOR, ['Type', 'Device', 'Devices']) //'Type/Device/Devices'
    );

    /* Модификаторы */
    $services->load(
        $NAMESPACE.'Type\Modify\Modify\\',
        $PATH.implode(DIRECTORY_SEPARATOR, ['Type', 'Modify', 'Modify']) //'Type/Modify/Modify'
    );


    /** @see https://symfony.com/doc/current/service_container/autowiring.html#dealing-with-multiple-implementations-of-the-same-type */
    $services->alias(
        SettingsMainInterface::class,
        SettingsMainRepository::class
    );

    $services->alias(
        CryptKeyInterface::class,
        CryptKey::class
    );

    $services
        ->set(BaksRoutingLoader::class)
        ->tag('routing.loader');

};
