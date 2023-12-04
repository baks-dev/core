<?php

namespace BaksDev\Core\Type\Gps;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\StringType;

final class GpsLatitudeType extends StringType
{
	
	public function convertToDatabaseValue($value, AbstractPlatform $platform): mixed
	{
		return (string) $value;
	}

	public function convertToPHPValue($value, AbstractPlatform $platform): mixed
	{
		return !empty($value) ? new GpsLatitude($value) : null;
	}
	
	
	public function getName(): string
	{
		return GpsLatitude::TYPE;
	}
	
	
	public function requiresSQLCommentHint(AbstractPlatform $platform) : bool
	{
		return true;
	}
	
}