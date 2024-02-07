<?php

namespace BaksDev\Core\Type\Gps;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\StringType;
use Doctrine\DBAL\Types\Type;

final class GpsLatitudeType extends Type
{
	
	public function convertToDatabaseValue($value, AbstractPlatform $platform): string
	{
		return (string) $value;
	}

	public function convertToPHPValue($value, AbstractPlatform $platform): ?GpsLatitude
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

    public function getSQLDeclaration(array $column, AbstractPlatform $platform): string
    {
        return $platform->getStringTypeDeclarationSQL($column);
    }
	
}