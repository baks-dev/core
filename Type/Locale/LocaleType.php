<?php

namespace BaksDev\Core\Type\Locale;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\StringType;
use Doctrine\DBAL\Types\Type;

final class LocaleType extends Type
{
    public const NAME = 'locale';


    public function convertToDatabaseValue($value, AbstractPlatform $platform): string
    {
        return (string) new Locale($value);
    }

    public function convertToPHPValue($value, AbstractPlatform $platform): ?Locale
    {
        return !empty($value) ? new Locale($value) : null;
    }


    public function getName(): string
    {
        return self::NAME;
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
