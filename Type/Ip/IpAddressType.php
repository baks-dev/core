<?php

namespace BaksDev\Core\Type\Ip;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\BigIntType;
use Doctrine\DBAL\Types\IntegerType;
use Doctrine\DBAL\Types\StringType;

final class IpAddressType extends BigIntType
{
    public const NAME = 'user_ip';
    
    public function convertToDatabaseValue($value, AbstractPlatform $platform): mixed
    {
        return $value instanceof IpAddress ? ip2long($value->getValue()) : $value;
    }
    
    public function convertToPHPValue($value, AbstractPlatform $platform): mixed
    {
        return !empty($value) ? new IpAddress(long2ip($value)) : null;
    }
    
    public function getName() : string
    {
        return self::NAME;
    }
    
    public function requiresSQLCommentHint(AbstractPlatform $platform) : bool
    {
        return true;
    }
    
}