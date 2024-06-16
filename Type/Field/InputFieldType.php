<?php

namespace BaksDev\Core\Type\Field;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\Type;

final class InputFieldType extends Type
{
    public function convertToDatabaseValue($value, AbstractPlatform $platform): string
    {
        return (string) $value;
    }

    public function convertToPHPValue($value, AbstractPlatform $platform): ?InputField
    {
        return !empty($value) ? new InputField($value) : null;
    }


    public function getName(): string
    {
        return InputField::TYPE;
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