<?php
/*
 *  Copyright 2024.  Baks.dev <admin@baks.dev>
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is furnished
 *  to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

namespace BaksDev\Core\Type\Device;

use BaksDev\Core\Type\Device\Devices\Collection\DeviceInterface;
use BaksDev\Core\Type\Device\Devices\Desktop;

final class Device
{
    public const string TYPE = 'device';

    public const string TEST = Desktop::class;

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
