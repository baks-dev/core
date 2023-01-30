<?php

namespace BaksDev\Core\Type\UidType;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\ConversionException;
use Doctrine\DBAL\Types\GuidType;
use Doctrine\DBAL\Types\StringType;
use Symfony\Component\Uid\AbstractUid;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Uid\UuidV4;

class UidType extends StringType
{
	
	public function convertToDatabaseValue($value, AbstractPlatform $platform) : mixed
	{
		$classType = $this->getClassType();
		
		if($value instanceof $classType && empty($value->getValue()))
		{
			return null;
		}
		
		/* Применяем фильтр UID */
		if($value == null || !preg_match('{^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$}Di', $value))
		{
			return $value;
		}
		
		$toString = $platform->hasNativeGuidType() ? 'toRfc4122' : 'toBinary';
		
		if(!($value instanceof $classType))
		{
			$value = new $classType($value);
		}
		
		return $value->getValue()->$toString();
	}
	
	
	public function convertToPHPValue($value, AbstractPlatform $platform) : mixed
	{
		
		$classType = $this->getClassType();
		
		if(null === $value)
		{
			return null;
		}
		
		if($value instanceof AbstractUid)
		{
			return new $classType($value);
		}
		
		if(!\is_string($value))
		{
			throw ConversionException::conversionFailedInvalidType(
				$value,
				$this->getName(),
				['null', 'string', AbstractUid::class]
			);
		}
		
		try
		{
			return new $classType(Uuid::fromString($value));
		}
		catch(\InvalidArgumentException $e)
		{
			throw ConversionException::conversionFailed($value, $this->getName(), $e);
		}
	}
	
	
	public function requiresSQLCommentHint(AbstractPlatform $platform) : bool
	{
		return !$platform->hasNativeGuidType();
	}
	
	
	public function getSQLDeclaration(array $column, AbstractPlatform $platform) : string
	{
		if($platform->hasNativeGuidType())
		{
			return $platform->getGuidTypeDeclarationSQL($column);
		}
		
		return $platform->getBinaryTypeDeclarationSQL(
			[
				'length' => '16',
				'fixed' => true,
			]
		);
	}
	
	
	public function getClassType() : ?string { return null; }
	
}