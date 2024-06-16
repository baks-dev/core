<?php

namespace BaksDev\Core\Type\Gps;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\StringType;
use Doctrine\DBAL\Types\Type;

final class GpsLongitudeType extends Type
{

    public function convertToDatabaseValue($value, AbstractPlatform $platform): string
    {
        return (string) $value;
    }


    public function convertToPHPValue($value, AbstractPlatform $platform): ?GpsLongitude
    {
        return !empty($value) ? new GpsLongitude($value) : null;
    }


    public function getName(): string
    {
        return GpsLongitude::TYPE;
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