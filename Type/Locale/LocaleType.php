<?php

namespace BaksDev\Core\Type\Locale;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\StringType;

final class LocaleType extends StringType
{
	public const NAME = 'locale';
	
	
	public function convertToDatabaseValue($value, AbstractPlatform $platform): mixed
	{
		return (string) $value;
	}
	
	public function convertToPHPValue($value, AbstractPlatform $platform): mixed
	{
        return !empty($value) ? new Locale($value) : null;
	}
	
	
	public function getName(): string
	{
		return self::NAME;
	}
	
	
	public function requiresSQLCommentHint(AbstractPlatform $platform) : bool
	{
		return true;
	}
	
}