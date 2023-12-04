<?php

namespace BaksDev\Core\Type\Ip;

use InvalidArgumentException;

final class IpAddress
{
	public const TYPE = 'user_ip';

	public const TEST = '127.0.0.1';

	private string $value;

	public function __construct(self|string $value)
	{
		if(!filter_var($value, FILTER_VALIDATE_IP))
		{
			throw new InvalidArgumentException('Incorrect ip.'.$value);
		}
		$this->value = $value;
	}

    public function __toString(): string
    {
        return $this->value;
    }

    public function getValue(): string
	{
		return $this->value;
	}

	public function isEqual(self $other) : bool
	{
		return $this->getValue() === $other->getValue();
	}
	
}