<?php

namespace BaksDev\Core\Type\Gps;

use InvalidArgumentException;

final class GpsLatitude
{
    public const TYPE = 'latitude';

    public const TEST = 41.40338;

    private ?string $value = null;

    public function __construct(self|string|float $value = null)
    {
        if($value === null)
        {
            return;
        }

        if($value instanceof self)
        {
            $this->value = $value->getValue();
        }

        $value = str_replace(',', '.', $value);
        $value = trim($value);

        if(!empty($value) && !preg_match('{^-?[\d]+\.[\d]{3,}$}Di', $value))
        {
            throw new InvalidArgumentException('Incorrect Gps Latitude '.$value);
        }

        $this->value = $value;
    }

    public function __toString(): string
    {
        return $this->value ?: '';
    }

    public function getValue(): string
    {
        return $this->value ?: '';
    }

    public function getFloat(): float
    {
        return (float) $this->value;
    }
}
