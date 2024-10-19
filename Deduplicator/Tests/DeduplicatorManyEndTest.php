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

declare(strict_types=1);

namespace BaksDev\Core\Deduplicator\Tests;

use BaksDev\Core\Deduplicator\DeduplicatorInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\DependencyInjection\Attribute\When;

/**
 * @group core
 * @group core-deduplicator
 *
 * @depends BaksDev\Core\Deduplicator\Tests\DeduplicatorManyStartTest::class
 */
#[When(env: 'test')]
class DeduplicatorManyEndTest extends KernelTestCase
{
    public function testUseCase(): void
    {
        /** @var DeduplicatorInterface $DeduplicatorInterface */
        $DeduplicatorInterface = self::getContainer()->get(DeduplicatorInterface::class);

        $DeduplicatorInterface
            ->namespace('DeduplicatorManyTest');


        $Deduplicator = $DeduplicatorInterface->deduplication(['fccb643e-3fb1-7b5a-9d23-27df53865c44']);
        self::assertFalse($Deduplicator->isExecuted());
        $Deduplicator->delete();

        $Deduplicator = $DeduplicatorInterface->deduplication(['13068500-fd2c-7596-99f4-18e435910881']);
        self::assertTrue($Deduplicator->isExecuted());
        $Deduplicator->delete();

        $Deduplicator = $DeduplicatorInterface->deduplication(['739d51a9-7b3c-74cc-8600-8b9b66ccc121']);
        self::assertFalse($Deduplicator->isExecuted());
        $Deduplicator->delete();
    }
}
