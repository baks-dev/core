<?php

namespace BaksDev\Core\Type\Ip;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\BigIntType;
use Doctrine\DBAL\Types\Type;

final class IpAddressType extends Type
{
    public const NAME = 'user_ip';

    public function convertToDatabaseValue($value, AbstractPlatform $platform): int
    {
        return (int) ip2long((string) $value);
    }

    public function convertToPHPValue($value, AbstractPlatform $platform): ?IpAddress
    {
        return !empty($value) ? new IpAddress(long2ip($value)) : null;
    }

    public function getName(): string
    {
        return self::NAME;
    }


    public function requiresSQLCommentHint(AbstractPlatform $platform): bool
    {
        return true;
    }

    public function getSQLDeclaration(array $column, AbstractPlatform $platform): string
    {
        return $platform->getBigIntTypeDeclarationSQL($column);
    }
}