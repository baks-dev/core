<?php
/*
 * This file is part of the FreshCentrifugoBundle.
 *
 * (c) Artem Henvald <genvaldartem@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare(strict_types=1);

namespace BaksDev\Core;

use BaksDev\Core\Repository\SettingsMain\SettingsMainInterface;
use BaksDev\Core\Repository\SettingsMain\SettingsMainRepository;
use BaksDev\Core\Type\Crypt\CryptKey;
use BaksDev\Core\Type\Crypt\CryptKeyInterface;
use BaksDev\Core\Type\Locale\Locales\LocaleInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symfony\Component\HttpKernel\Bundle\AbstractBundle;

class BaksDevCoreBundle extends AbstractBundle
{
    public const NAMESPACE = __NAMESPACE__.'\\';

    public const PATH = __DIR__.DIRECTORY_SEPARATOR;

    public function loadExtension(array $config, ContainerConfigurator $container, ContainerBuilder $builder): void
    {
        $services = $container->services()
            ->defaults()
            ->autowire()
            ->autoconfigure();

        $services->load(self::NAMESPACE, self::PATH)
            ->exclude([
                self::PATH.'{Entity,Resources,Type}',
                self::PATH.'**/*Message.php',
                self::PATH.'**/*DTO.php',
                self::PATH.'**/regions.php',
            ]);

        /* Language */
        $services->load(
            self::NAMESPACE.'Type\Locale\Locales\\',
            self::PATH.'Type/Locale/Locales'
        );

        /* Device */
        $services->load(
            self::NAMESPACE.'Type\Device\Devices\\',
            self::PATH.'Type/Device/Devices'
        );

        /* Модификаторы */
        $services->load(
            self::NAMESPACE.'Type\Modify\Modify\\',
            self::PATH.'Type/Modify/Modify'
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




        //        $services->load(self::NAMESPACE, self::PATH)
        //            ->exclude([
        //                self::PATH.'{Entity,Resources,Type}',
        //                self::PATH.'**/*Message.php',
        //                self::PATH.'**/*DTO.php',
        //            ]);
    }

    public static function getDeclared(): array
    {
        return array_filter(
            get_declared_classes(),
            static function($className) {
                return in_array(LocaleInterface::class, class_implements($className), true);
            }
        );
    }
}
