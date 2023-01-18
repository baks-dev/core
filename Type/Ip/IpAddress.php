<?php

namespace App\System\Type\Ip;

final class IpAddress
{
    public const TYPE = 'user_ip';
    
    private string $value;
    
    /**
     * IpAddress constructor.
     *
     * @param string $value
     */
    public function __construct(string $value)
    {
        if(!filter_var($value, FILTER_VALIDATE_IP))
        {
            throw new \InvalidArgumentException('Incorrect ip.');
        }
        $this->value = $value;
    }
    
    /**
     * @return string
     */
    public function getValue() : string
    {
        return $this->value;
    }
    
    /**
     * @param IpAddress $other
     *
     * @return bool
     */
    public function isEqual(self $other) : bool
    {
        return $this->getValue() === $other->getValue();
    }
    
}