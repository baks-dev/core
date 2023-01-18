<?php

namespace App\System\Type\Locale;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\StringType;

final class LocaleType extends StringType
{
    public const NAME = 'locale';
    
    public function convertToDatabaseValue($value, AbstractPlatform $platform) : mixed
    {
        return $value instanceof Locale ? $value->getValue() : (new Locale($value))->getValue();
    }
    
    public function convertToPHPValue($value, AbstractPlatform $platform) : mixed
    {
        return !empty($value) ? new Locale($value) : $value;
    }
    
    public function getName() : string
    {
        return self::NAME;
    }
    
    public function requiresSQLCommentHint(AbstractPlatform $platform) : bool
    {
        return true;
    }
    
}