<?php

namespace BaksDev\Core\Type\Gps;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\StringType;

final class GpsLongitudeType extends StringType
{
	
	public function convertToDatabaseValue($value, AbstractPlatform $platform): mixed
	{
		return $value instanceof GpsLongitude ? $value->getValue() : $value;
	}
	
	
	public function convertToPHPValue($value, AbstractPlatform $platform): mixed
	{
		return !empty($value) ? new GpsLongitude($value) : null;
	}
	
	
	public function getName(): string
	{
		return GpsLongitude::TYPE;
	}
	
	
	public function requiresSQLCommentHint(AbstractPlatform $platform) : bool
	{
		return true;
	}
	
}