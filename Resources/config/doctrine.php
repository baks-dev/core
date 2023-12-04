<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use BaksDev\Core\Type\Device\Device;
use BaksDev\Core\Type\Device\DeviceType;
use BaksDev\Core\Type\Field\InputField;
use BaksDev\Core\Type\Field\InputFieldType;
use BaksDev\Core\Type\Gps\GpsLatitude;
use BaksDev\Core\Type\Gps\GpsLatitudeType;
use BaksDev\Core\Type\Gps\GpsLongitude;
use BaksDev\Core\Type\Gps\GpsLongitudeType;
use BaksDev\Core\Type\Ip\IpAddress;
use BaksDev\Core\Type\Ip\IpAddressType;
use BaksDev\Core\Type\Locale\Locale;
use BaksDev\Core\Type\Locale\LocaleType;
use BaksDev\Core\Type\Modify\ModifyAction;
use BaksDev\Core\Type\Modify\ModifyActionType;
use Symfony\Config\DoctrineConfig;

return static function (ContainerConfigurator $container, DoctrineConfig $doctrine) {
    $doctrine->dbal()->type(ModifyAction::TYPE)->class(ModifyActionType::class);
    $doctrine->dbal()->type(IpAddress::TYPE)->class(IpAddressType::class);
    $doctrine->dbal()->type(Locale::TYPE)->class(LocaleType::class);
    $doctrine->dbal()->type(InputField::TYPE)->class(InputFieldType::class);
    $doctrine->dbal()->type(GpsLatitude::TYPE)->class(GpsLatitudeType::class);
    $doctrine->dbal()->type(GpsLongitude::TYPE)->class(GpsLongitudeType::class);
    $doctrine->dbal()->type(Device::TYPE)->class(DeviceType::class);
};
