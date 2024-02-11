<?php

namespace BaksDev\Core\Type\Crypt;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\Type;
use InvalidArgumentException;

final class CryptType extends Type
{
    public function convertToPHPValue($value, AbstractPlatform $platform): ?Crypt
    {
        return new Crypt($value);
    }

    public function getName(): string
    {
        return Crypt::TYPE;
    }

    public function canRequireSQLConversion(): true
    {
        return true;
    }

    public function convertToPHPValueSQL($sqlExpr, AbstractPlatform $platform): string
    {
        if(!$PG_CRYPT_KEY = self::getCryptKey())
        {
            throw new InvalidArgumentException('Not found PG_CRYPT_KEY');
        }

        return sprintf("pgp_sym_decrypt(%s, %s)", $sqlExpr, $PG_CRYPT_KEY);
    }

    public function convertToDatabaseValueSQL($sqlExpr, AbstractPlatform $platform): string
    {
        if(!$PG_CRYPT_KEY = self::getCryptKey())
        {
            throw new InvalidArgumentException('Not found PG_CRYPT_KEY');
        }

        return sprintf("pgp_sym_encrypt(%s, %s)", $sqlExpr, $PG_CRYPT_KEY);
    }

    public function getSQLDeclaration(array $column, AbstractPlatform $platform): string
    {
        return $platform->getBinaryTypeDeclarationSQL($column);
    }

    public function requiresSQLCommentHint(AbstractPlatform $platform): bool
    {
        return true;
    }

    public static function getCryptKey(): bool|string
    {
        $CryptKeys = array_filter(
            get_declared_classes(),
            static function($className) {
                return in_array(CryptKeyInterface::class, class_implements($className), true);
            }
        );

        $current = current($CryptKeys);

        /** @var CryptKeyInterface $CryptKeyClass */
        $CryptKeyClass = class_exists($current) ? (new $current) : null;

        return $CryptKeyClass instanceof CryptKeyInterface ? $CryptKeyClass->getCryptKey() : false;
    }
}