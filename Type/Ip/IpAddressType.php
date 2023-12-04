<?php

namespace BaksDev\Core\Type\Ip;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\BigIntType;

final class IpAddressType extends BigIntType
{
    public const NAME = 'user_ip';

    public function convertToDatabaseValue($value, AbstractPlatform $platform): mixed
    {
        return (int) ip2long((string) $value);
    }

    public function convertToPHPValue($value, AbstractPlatform $platform): mixed
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

}