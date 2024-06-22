<?php

namespace BaksDev\Core\Type\Device;

use BaksDev\Core\Type\Device\Devices\Collection\DeviceInterface;
use BaksDev\Core\Type\Device\Devices\Desktop;

final class Device
{
    public const TYPE = 'device';

    public const TEST = Desktop::class;

    private DeviceInterface $device;

    /**
     * По умолчанию присваивается Language Ru.
     */
    public function __construct(self|string|DeviceInterface $device)
    {
        if($device instanceof DeviceInterface)
        {
            $this->device = $device;
            return;
        }

        if(is_string($device) && class_exists($device))
        {
            $this->device = new $device();
            return;
        }

        if($device instanceof $this)
        {
            $this->device = $device->getDevice();
            return;
        }

        /** @var DeviceInterface $device */
        foreach(self::getDeclared() as $declare)
        {
            if($declare::equals($device))
            {
                $this->device = new $declare();
                return;
            }
        }
    }

    public function __toString(): string
    {
        return (string) $this->device;
    }

    public function getDevice(): DeviceInterface
    {
        return $this->device;
    }

    public function getDeviceValue(): string
    {
        return $this->device->getValue();
    }

    public static function cases(): array
    {
        $case = null;

        foreach(self::getDeclared() as $declared)
        {
            /** @var DeviceInterface $declared */
            $class = new $declared();
            $case[$class->getSort()] = new self($class);
        }

        ksort($case);

        return $case;
    }

    public static function getDeclared(): array
    {
        return array_filter(
            get_declared_classes(),
            static function ($className) {
                return in_array(DeviceInterface::class, class_implements($className), true);
            }
        );
    }

    public function equals(mixed $device): bool
    {
        if(is_string($device) && class_exists($device))
        {
            $device = new $device();
        }

        if($device instanceof DeviceInterface)
        {
            return (string) $device === (string) $this->device;
        }

        if($device instanceof self)
        {
            return (string) $device->device === (string) $this->device;
        }

        return $device === (string) $this->device;
    }
}
