<?php

namespace BaksDev\Core\Entity\Tests\EntityEvent\Readonly;

use BaksDev\Users\User\Type\Id\UserUid;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\DependencyInjection\Attribute\When;

/**
 * @group core
 * @group core-entity
 */
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
