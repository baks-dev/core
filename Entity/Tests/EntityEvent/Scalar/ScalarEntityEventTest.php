<?php

namespace BaksDev\Core\Entity\Tests\EntityEvent\Scalar;

use BaksDev\Users\User\Type\Id\UserUid;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\DependencyInjection\Attribute\When;

/**
 * @group core
 * @group core-entity
 */
#[When(env: 'test')]
final class ScalarEntityEventTest extends KernelTestCase
{
    public function testEntityEvent(): void
    {
        $Entity = new Entity();
        $Entity->setInt(123);
        $Entity->setString('aicNblJxik');
        $Entity->setBool(false);


        $DTO = $Entity->getDto(DTO::class);
        self::assertInstanceOf(DTO::class, $DTO);

        /** @var DTO $DTO */
        $DTO = $Entity->getDto($DTO);
        self::assertInstanceOf(DTO::class, $DTO);


        self::assertEquals($DTO->getEvent(), $Entity->getId());
        self::assertEquals(UserUid::TEST, (string) $DTO->getEvent());

        self::assertEquals($DTO->getInt(), $Entity->getInt());
        self::assertEquals(123, $DTO->getInt());

        self::assertEquals($DTO->getString(), $Entity->getString());
        self::assertEquals('aicNblJxik', $DTO->getString());

        self::assertEquals($DTO->getBool(), $Entity->getBool());
        self::assertFalse($DTO->getBool());

    }


    public function testEntityEventClone(): void
    {
        $Entity = new Entity();
        $Entity->setInt(123);
        $Entity->setString('aicNblJxik');
        $Entity->setBool(false);


        $Clone = $Entity->cloneEntity();
        $DTO = $Clone->getDto(DTO::class);

        $this->assertNotEquals((string) $Clone->getId(), (string) $Entity->getId());
        $this->assertNotEquals((string) $Entity, (string) $Clone);

        self::assertEquals($DTO->getInt(), $Entity->getInt());
        self::assertEquals(123, $DTO->getInt());

        self::assertEquals($DTO->getString(), $Entity->getString());
        self::assertEquals('aicNblJxik', $DTO->getString());

        self::assertEquals($DTO->getBool(), $Entity->getBool());
        self::assertFalse($DTO->getBool());

    }

    public function testEntityEventCloneEdit(): void
    {
        $Entity = new Entity();
        $Entity->setInt(123);
        $Entity->setString('aicNblJxik');
        $Entity->setBool(false);

        /** @var DTO $DTO */
        $DTO = $Entity->getDto(DTO::class);
        $DTO->setInt(234);
        $DTO->setString('FYauNiWxod');
        $DTO->setBool(true);


        /** @var DTO $EditDto */
        $Clone = $Entity->cloneEntity();
        $Clone->setEntity($DTO);

        $this->assertNotEquals((string) $Clone->getId(), UserUid::TEST);

        self::assertEquals($DTO->getInt(), $Clone->getInt());
        self::assertEquals(234, $DTO->getInt());

        self::assertEquals($DTO->getString(), $Clone->getString());
        self::assertEquals('FYauNiWxod', $DTO->getString());

        self::assertEquals($DTO->getBool(), $Clone->getBool());
        self::assertTrue($DTO->getBool());


        /** @var DTO $EditDto */
        $EditDto = $Clone->getDto(DTO::class);

        $this->assertNotEquals((string) $Clone->getId(), (string) $Entity->getId());
        $this->assertNotEquals((string) $Entity, (string) $Clone);

        self::assertEquals($EditDto->getInt(), $Clone->getInt());
        self::assertEquals(234, $DTO->getInt());

        self::assertEquals($EditDto->getString(), $Clone->getString());
        self::assertEquals('FYauNiWxod', $EditDto->getString());

        self::assertEquals($EditDto->getBool(), $Clone->getBool());
        self::assertTrue($EditDto->getBool());

    }
}
