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

namespace BaksDev\Core\Entity\Tests\EntityEvent\Readonly;

use BaksDev\Users\User\Type\Id\UserUid;
use PHPUnit\Framework\Attributes\Group;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\DependencyInjection\Attribute\When;

#[Group('core')]
#[Group('core-entity')]
#[When(env: 'test')]
final class ReadonlyEntityEventTest extends KernelTestCase
{
    public function testEntityEvent(): void
    {
        $Entity = new Entity();

        $DTO = $Entity->getDto(DTO::class);
        self::assertTrue($DTO instanceof DTO);

        /** @var DTO $DTO */
        $DTO = $Entity->getDto($DTO);
        self::assertTrue($DTO instanceof DTO);


        self::assertEquals($DTO->getEvent(), $Entity->getId());
        self::assertEquals((string) $DTO->getEvent(), UserUid::TEST);

        self::assertEquals((string) $DTO->getReadonly(), (string) $Entity->getReadonly());
        self::assertEquals((string) $DTO->getReadonly(), UserUid::TEST);
    }


    public function testEntityEventClone(): void
    {
        $Entity = new Entity();
        $Clone = $Entity->cloneEntity();
        $DTO = $Clone->getDto(DTO::class);

        $this->assertNotEquals((string) $Clone->getId(), (string) $Entity->getId());
        $this->assertNotEquals((string) $Entity, (string) $Clone);

        $this->assertEquals((string) $DTO->getReadonly(), (string) $Clone->getReadonly());
        $this->assertEquals((string) $DTO->getReadonly(), UserUid::TEST);
    }

    public function testEntityEventCloneEdit(): void
    {
        $Entity = new Entity();
        $this->assertEquals((string) $Entity->getReadonly(), UserUid::TEST);

        /** @var DTO $DTO */
        $DTO = $Entity->getDto(DTO::class);
        $DTO->setReadonly(clone new UserUid());


        /** @var DTO $EditDto */
        $Clone = $Entity->cloneEntity();
        $Clone->setEntity($DTO);

        $this->assertNotEquals((string) $Clone->getId(), UserUid::TEST);
        $this->assertEquals((string) $Entity->getReadonly(), UserUid::TEST);
        $this->assertEquals((string) $Clone->getReadonly(), UserUid::TEST);
        $this->assertEquals((string) $Clone->getReadonly(), (string) $Entity->getReadonly());

        /** @var DTO $EditDto */
        $EditDto = $Clone->getDto(DTO::class);

        $this->assertNotEquals((string) $Clone->getId(), (string) $Entity->getId());
        $this->assertNotEquals((string) $Entity, (string) $Clone);

        $this->assertEquals((string) $EditDto->getReadonly(), (string) $Clone->getReadonly());
        $this->assertEquals((string) $EditDto->getReadonly(), UserUid::TEST);

    }
}
