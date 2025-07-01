<?php
/*
 *  Copyright 2025.  Baks.dev <admin@baks.dev>
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

namespace BaksDev\Core\Deduplicator\Tests;

use BaksDev\Core\Deduplicator\DeduplicatorInterface;
use BaksDev\Products\Product\Type\Id\ProductUid;
use PHPUnit\Framework\Attributes\Group;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\DependencyInjection\Attribute\When;

#[Group('core')]
#[Group('core-deduplicator')]
#[When(env: 'test')]
class DeduplicatorStartTest extends KernelTestCase
{
    public function testUseCase(): void
    {
        //$timestamp = time();
        //\DateTimeImmutable('@'.$timestamp);

        /** @var DeduplicatorInterface $DeduplicatorInterface */
        $DeduplicatorInterface = self::getContainer()->get(DeduplicatorInterface::class);

        $Deduplicator = $DeduplicatorInterface
            ->namespace('DeduplicatorTest')
            ->deduplication([
                'key1',
                'key2',
                new ProductUid(ProductUid::TEST),
                ['key3' => 'value']
            ]);


        $Deduplicator->delete();

        self::assertFalse($Deduplicator->isExecuted());

        $Deduplicator->save();

        self::assertTrue($Deduplicator->isExecuted());

        /** Проверяем отложенное время согласно настройке кеширования */
        self::assertEquals(3, $Deduplicator->getAndSaveNextTime('3 seconds')->s); // следующее время на 3 сек позже
        self::assertEquals(6, $Deduplicator->getAndSaveNextTime('3 seconds')->s); // следующее время на 6 сек позже
        self::assertEquals(9, $Deduplicator->getAndSaveNextTime('3 seconds')->s); // следующее время на 9 сек позже

    }
}
