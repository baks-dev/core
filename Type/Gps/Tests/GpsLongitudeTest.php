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

namespace BaksDev\Core\Type\Gps\Tests;

use BaksDev\Core\Doctrine\DBALQueryBuilder;
use BaksDev\Core\Type\Gps\GpsLatitude;
use BaksDev\Core\Type\Gps\GpsLongitude;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\DependencyInjection\Attribute\When;


/**
 * @group core
 * @group core-gps
 */
#[When(env: 'test')]
class GpsLongitudeTest extends KernelTestCase
{

    public function testUseCase(): void
    {
        /** @see GpsLatitudeDTO */
        $GpsLongitude = new GpsLongitude(0.12345);
        self::assertEquals('0.12345', $GpsLongitude);

        /** @see GpsLatitudeDTO */
        $GpsLongitude = new GpsLongitude(35.353);
        self::assertEquals('35.353', $GpsLongitude);

        $GpsLongitude = new GpsLatitude('0.12345');
        self::assertEquals('0.12345', $GpsLongitude);

        $GpsLongitude = new GpsLatitude('0,12345');
        self::assertEquals('0.12345', $GpsLongitude);

        $GpsLongitude = new GpsLatitude('-76.298777');
        self::assertEquals('-76.298777', $GpsLongitude);


    }

}