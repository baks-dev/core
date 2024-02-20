<?php

namespace BaksDev\Core\Type\UidType;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\ConversionException;
use Doctrine\DBAL\Types\StringType;
use InvalidArgumentException;
use Symfony\Component\Uid\AbstractUid;
use Symfony\Component\Uid\Uuid;
use function is_string;

class UidType extends StringType
{
    public function convertToDatabaseValue($value, AbstractPlatform $platform): mixed
    {
        $classType = $this->getClassType();

        if($value === null || ($value instanceof $classType && empty($value->getValue())))
        {
            return null;
        }

        if($value instanceof $classType)
        {
            return $value->getValue()->toRfc4122();
        }

        /* Применяем фильтр UID */
        if(is_string($value) && Uid::isUid($value) === true)
        {
            $value = new $classType($value);
            return $value->getValue()->toRfc4122();
        }

        throw new InvalidArgumentException(sprintf('Invalid Uid class %s', $classType));
    }


    public function convertToPHPValue($value, AbstractPlatform $platform): mixed
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

        if(is_string($value))
        {
            return new $classType(Uuid::fromString($value));
        }

        throw new InvalidArgumentException('Invalid Uid Convert To PHP');
    }


    public function requiresSQLCommentHint(AbstractPlatform $platform): bool
    {
        return true;
    }


    public function getSQLDeclaration(array $column, AbstractPlatform $platform): string
    {
        return $platform->getGuidTypeDeclarationSQL($column);
    }


}