<?php

namespace BaksDev\Core\Type\Modify;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\StringType;
use Doctrine\DBAL\Types\Type;

final class ModifyActionType extends Type
{
    public function convertToDatabaseValue($value, AbstractPlatform $platform): string
    {
        return (string) $value;
    }

    public function convertToPHPValue($value, AbstractPlatform $platform): ?ModifyAction
    {
        return !empty($value) ? new ModifyAction($value) : null;
    }

    public function getName(): string
    {
        return ModifyAction::TYPE;
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