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

namespace BaksDev\Core\Messenger\Tests;

use BaksDev\Core\Messenger\MessageDelay;
use BaksDev\Core\Messenger\MessageDispatchInterface;
use DateInterval;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\DependencyInjection\Attribute\When;


/**
 * @group core
 */
#[When(env: 'test')]
class MessageDelayTest extends KernelTestCase
{
    public function testUseCase(): void
    {

        $MessageDelay = new MessageDelay(DateInterval::createFromDateString('1 seconds'));
        self::assertEquals(1000, $MessageDelay->getMilliseconds());

        $MessageDelay = new MessageDelay(DateInterval::createFromDateString('1 second'));
        self::assertEquals(1000, $MessageDelay->getMilliseconds());


        /** @var MessageDispatchInterface $MessageDispatch */
        $MessageDispatch = self::getContainer()->get(MessageDispatchInterface::class);

        $MessageDispatch->dispatch(
            message: new class { },
            stamps: [$MessageDelay],
            transport: 'test'
        );


        $MessageDelay = new MessageDelay(DateInterval::createFromDateString('1 minutes'));
        self::assertEquals(60000, $MessageDelay->getMilliseconds());

        $MessageDelay = new MessageDelay(DateInterval::createFromDateString('1 minute'));
        self::assertEquals(60000, $MessageDelay->getMilliseconds());


        $MessageDelay = new MessageDelay(DateInterval::createFromDateString('1 hours'));
        self::assertEquals(3600000, $MessageDelay->getMilliseconds());

        $MessageDelay = new MessageDelay(DateInterval::createFromDateString('1 hour'));
        self::assertEquals(3600000, $MessageDelay->getMilliseconds());


        $MessageDelay = new MessageDelay(DateInterval::createFromDateString('1 days'));
        self::assertEquals(86400000, $MessageDelay->getMilliseconds());

        $MessageDelay = new MessageDelay(DateInterval::createFromDateString('1 day'));
        self::assertEquals(86400000, $MessageDelay->getMilliseconds());


        /**
         * Задержка в миллисекундах отложенного сообщения не может быть больше одних суток
         */

        $MessageDelay = new MessageDelay(DateInterval::createFromDateString('2 days'));
        self::assertEquals(86400000, $MessageDelay->getMilliseconds());

        $MessageDelay = new MessageDelay(DateInterval::createFromDateString('2 day'));
        self::assertEquals(86400000, $MessageDelay->getMilliseconds());

        $MessageDelay = new MessageDelay(DateInterval::createFromDateString('1 weeks'));
        self::assertEquals(86400000, $MessageDelay->getMilliseconds());

        $MessageDelay = new MessageDelay(DateInterval::createFromDateString('1 week'));
        self::assertEquals(86400000, $MessageDelay->getMilliseconds());

        $MessageDelay = new MessageDelay(DateInterval::createFromDateString('1 month'));
        self::assertEquals(86400000, $MessageDelay->getMilliseconds());

        $MessageDelay = new MessageDelay(DateInterval::createFromDateString('1 month'));
        self::assertEquals(86400000, $MessageDelay->getMilliseconds());

        $MessageDelay = new MessageDelay(DateInterval::createFromDateString('1 years'));
        self::assertEquals(86400000, $MessageDelay->getMilliseconds());

        $MessageDelay = new MessageDelay(DateInterval::createFromDateString('1 year'));
        self::assertEquals(86400000, $MessageDelay->getMilliseconds());


    }

}