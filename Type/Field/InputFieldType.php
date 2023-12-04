<?php

namespace BaksDev\Core\Type\Field;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\StringType;

final class InputFieldType extends StringType
{
	public function convertToDatabaseValue($value, AbstractPlatform $platform): mixed
	{
		return (string) $value;
	}
	
	public function convertToPHPValue($value, AbstractPlatform $platform): mixed
	{
        return !empty($value) ? new InputField($value) : null;
	}
	
	
	public function getName(): string
	{
		return InputField::TYPE;
	}
	
	
	public function requiresSQLCommentHint(AbstractPlatform $platform) : bool
	{
		return true;
	}
	
}