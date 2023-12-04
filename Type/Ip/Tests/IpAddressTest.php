<?php
/*
 *  Copyright 2023.  Baks.dev <admin@baks.dev>
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

declare(strict_types=1);

namespace BaksDev\Core\Type\Ip\Tests;

use BaksDev\Core\Type\Ip\IpAddress;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

/**
 * @group core
 */
final class IpAddressTest extends TestCase
{
    public function testCanBeCreatedFromValidIpAddress()
    {
        $ipAddress = new IpAddress('127.0.0.1');
        $this->assertInstanceOf(IpAddress::class, $ipAddress);
    }

    public function testCannotBeCreatedFromInvalidIpAddress()
    {
        $this->expectException(InvalidArgumentException::class);
        $ipAddress = new IpAddress('invalid');
    }

    public function testCanGetIpAddressValue()
    {
        $ipAddress = new IpAddress('127.0.0.1');
        $this->assertEquals('127.0.0.1', $ipAddress->getValue());
    }

    public function testToStringReturnsValue()
    {
        $ipAddress = new IpAddress('127.0.0.1');
        $this->assertEquals('127.0.0.1', (string)$ipAddress);
    }

    public function testIsEqual()
    {
        $ipAddress1 = new IpAddress('127.0.0.1');
        $ipAddress2 = new IpAddress('127.0.0.1');
        $this->assertTrue($ipAddress1->isEqual($ipAddress2));

        $ipAddress3 = new IpAddress('192.168.0.1');
        $this->assertFalse($ipAddress1->isEqual($ipAddress3));
    }
}