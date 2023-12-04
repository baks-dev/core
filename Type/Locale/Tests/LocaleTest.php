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

namespace BaksDev\Core\Type\Locale\Tests;

use BaksDev\Core\Type\Locale\Locale;
use BaksDev\Core\Type\Locale\Locales\LocaleCollection;
use BaksDev\Core\Type\Locale\Locales\LocaleDisable;
use BaksDev\Core\Type\Locale\Locales\LocaleInterface;
use BaksDev\Core\Type\Locale\Locales\Ru;
use BaksDev\Core\Type\Locale\LocaleType;
use Doctrine\DBAL\Platforms\AbstractPlatform;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\DependencyInjection\Attribute\When;

/**
 * @group core
 */
#[When(env: 'test')]
final class LocaleTest extends KernelTestCase
{
    public function testUseCase(): void
    {
        /** @var LocaleCollection $LocaleCollection */
        $LocaleCollection = self::getContainer()->get(LocaleCollection::class);

        /** @var LocaleInterface $case */
        foreach($LocaleCollection->cases() as $case)
        {
            $Locale = new Locale($case->getValue());

            if($Locale->getLocal() instanceof LocaleDisable)
            {
                continue;
            }

            self::assertTrue($Locale->equals($case::class)); // немспейс интерфейса
            self::assertTrue($Locale->equals($case)); // объект интерфейса
            self::assertTrue($Locale->equals($case->getValue())); // срока
            self::assertTrue($Locale->equals($Locale)); // объект класса

            $LocaleType = new LocaleType();
            $platform = $this->getMockForAbstractClass(AbstractPlatform::class);

            $convertToDatabase = $LocaleType->convertToDatabaseValue($Locale, $platform);
            self::assertEquals($Locale->getLocalValue(), $convertToDatabase);

            $convertToPHP = $LocaleType->convertToPHPValue($convertToDatabase, $platform);
            self::assertInstanceOf(Locale::class, $convertToPHP);
            self::assertEquals($case, $convertToPHP->getLocal());

        }

        $Locale = new Locale(Ru::class);
        self::assertFalse($Locale->equals('QFnJXMDjyv'));


    }
}