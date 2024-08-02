<?php

namespace BaksDev\Core\Type\Device;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\StringType;
use Doctrine\DBAL\Types\Type;

final class DeviceType extends Type
{
    public function convertToDatabaseValue($value, AbstractPlatform $platform): string
    {
        return (string) new Device($value);
    }

    public function convertToPHPValue($value, AbstractPlatform $platform): ?Device
    {
        return !empty($value) ? new Device($value) : null;
    }

    public function getName(): string
    {
        return Device::TYPE;
    }


    public function requiresSQLCommentHint(AbstractPlatform $platform): bool
    {
        return true;
    }

    public function getSQLDeclaration(array $column, AbstractPlatform $platform): string
    {
        return $platform->getStringTypeDeclarationSQL($column);
    }

}
