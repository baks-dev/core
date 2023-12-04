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

        if($value instanceof $classType && empty($value->getValue()))
        {
            return null;
        }

        /* Применяем фильтр UID */
        if($value == null || !preg_match('{^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$}Di', $value))
        {
            return $value;
        }

        //$toString = $platform->hasNativeGuidType() ? 'toRfc4122' : 'toBinary';

        if(!($value instanceof $classType))
        {
            $value = new $classType($value);
        }

        //return $value->getValue()->$toString();
        return $value->getValue()->toRfc4122();
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

        if(!is_string($value))
        {
            throw ConversionException::conversionFailedInvalidType(
                $value,
                $value::TYPE,
                ['null', 'string', AbstractUid::class],
            );
        }

        try
        {
            return new $classType(Uuid::fromString($value));
        } catch(InvalidArgumentException $e)
        {
            throw ConversionException::conversionFailed($value, $this->getName(), $e);
        }
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