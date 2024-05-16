<?php

namespace BaksDev\Core\Type\Gps;

use InvalidArgumentException;

final class GpsLongitude
{
    public const TYPE = 'longitude';

    public const TEST = 2.17403;

    private ?string $value = null;

    public function __construct(self|string|float $value = null)
    {
        if ($value === null)
        {
            return;
        }

        if ($value instanceof self)
        {
            $this->value = $value->getValue();
        }

        $value = str_replace(',', '.', $value);
        $value = trim($value);

        if (!empty($value) && !preg_match('{^[\d]+\.[\d]{4,}$}Di', (string) $value))
        {
            throw new InvalidArgumentException('Incorrect Gps.');
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
