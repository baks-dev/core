<?php

namespace BaksDev\Core\Type\Modify;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\StringType;

final class ModifyActionType extends StringType
{
	public function convertToDatabaseValue($value, AbstractPlatform $platform): mixed
	{
		return (string) $value;
	}
    
	public function convertToPHPValue($value, AbstractPlatform $platform): mixed
	{
        return !empty($value) ? new ModifyAction($value) : null;
	}

	public function getName(): string
	{
		return ModifyAction::TYPE;
	}

	public function requiresSQLCommentHint(AbstractPlatform $platform) : bool
	{
		return true;
	}

}