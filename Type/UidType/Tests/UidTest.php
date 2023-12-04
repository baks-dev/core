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

namespace BaksDev\Core\Type\UidType\Tests;

use BaksDev\Core\Type\UidType\Uid;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

/**
 * @group core
 * @group core-uid
 */
final class UidTest extends TestCase
{
    public function testCanBeCreatedFromValidUid()
    {
        $uid = new UidClass('0188a9a2-7db3-77c6-b362-41075ebd6f09');
        $this->assertInstanceOf(Uid::class, $uid);
    }

    public function testCannotBeCreatedFromInvalidUid()
    {
        $this->expectException(InvalidArgumentException::class);
        $uid = new UidClass('invalid');
    }

    public function testGetUidReturnsUid()
    {
        $uid = new UidClass(UidClass::TEST);
        $this->assertEquals(UidClass::TEST, $uid->getValue());
    }

    public function testToStringReturnsUid()
    {
        $uid = new UidClass(UidClass::TEST);
        $this->assertEquals(UidClass::TEST, (string)$uid);
    }

    public function testIsEqual()
    {
        $uid1 = new UidClass(UidClass::TEST);
        $uid2 = new UidClass(UidClass::TEST);

        $this->assertTrue($uid1->equals($uid2));

        $uid3 = clone new UidClass();
        $this->assertFalse($uid1->equals($uid3));

    }

    public function testMd5()
    {
        $md5 = md5('different-uid');
        $uid3 = (new UidClass())->md5($md5);

        $UidMd5 = explode('-', (string) $uid3);
        $this->assertEquals($UidMd5[0], substr($md5, 0, 8 ));
        $this->assertEquals($UidMd5[1], substr($md5, 8, 4));
        $this->assertEquals($UidMd5[2], '7'.substr($md5, 12, 3));
        $this->assertEquals($UidMd5[3], '9cb9');
        $this->assertEquals($UidMd5[4], substr($md5, 20));
    }
}