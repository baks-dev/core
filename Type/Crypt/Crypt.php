<?php

namespace BaksDev\Core\Type\Crypt;


use BaksDev\Core\Type\Device\Devices\Collection\DeviceInterface;
use BaksDev\Core\Type\Device\Devices\Desktop;

final class Crypt
{
    public const TYPE = 'type_crypt';

    private ?string $crypt;

    public function __construct(?string $crypt)
    {
        $this->crypt = $crypt;
    }

    public function __toString(): string
    {
        return $this->crypt ?: '';
    }

    public function getValue(): ?string
    {
        return $this->crypt;
    }

    public function equals(mixed $crypt): bool
    {
        return $crypt === $this->crypt;
    }
}
