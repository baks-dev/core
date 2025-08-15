<?php
/*
 *  Copyright 2025.  Baks.dev <admin@baks.dev>
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is furnished
 *  to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

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
    public const string TYPE = 'uuid';

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

        $className = explode('\\', $classType);
        $className = end($className);

        if(is_object($value))
        {
            $objectClassname = explode('\\', $value::class);
            $objectClassname = end($objectClassname);

            throw new InvalidArgumentException(sprintf('Invalid %s: (%s %s)', $className, $objectClassname, $value));
        }

        throw new InvalidArgumentException(sprintf('Invalid %s: %s', $className, $value));
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