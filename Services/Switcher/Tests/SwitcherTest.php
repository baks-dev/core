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

namespace BaksDev\Core\Services\Switcher\Tests;

use BaksDev\Core\Services\Switcher\Switcher;
use PHPUnit\Framework\TestCase;

/**
 * @group core
 */
final class SwitcherTest extends TestCase
{
    public function testToRus(): void
    {
        $switcher = new Switcher();

        $this->assertEquals('йцукенгшщзхъфывапролджэячсмитьбю', $switcher->toRus('qwertyuiop[]asdfghjkl;\'zxcvbnm,.', false));
        $this->assertEquals('1234567890', $switcher->toRus(1234567890, false));
    }

    public function testToEng(): void
    {
        $switcher = new Switcher();

        $this->assertEquals('qwertyuiop[]asdfghjkl;\'zxcvbnm,.', $switcher->toEng('йцукенгшщзхъфывапролджэячсмитьбю', false));
        $this->assertEquals('1234567890', $switcher->toEng(1234567890, false));
    }

    public function testTransliterate(): void
    {
        $switcher = new Switcher();

        $this->assertEquals('privet', $switcher->transliterate('привет'));
    }

    public function testIsRus(): void
    {
        $switcher = new Switcher();

        $russianString = 'Привет';
        $this->assertTrue($switcher->isRus($russianString));

        $englishString = 'Hello';
        $this->assertFalse($switcher->isRus($englishString));
    }

    public function testIsEng(): void
    {
        $switcher = new Switcher();

        $russianString = 'Привет';
        $this->assertFalse($switcher->isEng($russianString));

        $englishString = 'Hello';
        $this->assertTrue($switcher->isEng($englishString));
    }
}