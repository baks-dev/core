<?php

namespace BaksDev\Core\Entity\Tests\EntityEvent\OneToMany;

use BaksDev\Users\User\Type\Id\UserUid;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\DependencyInjection\Attribute\When;

/**
 * @group core
 * @group core-entity
 */
#[When(env: 'test')]
final class OneToManyEntityEventTest extends KernelTestCase
{
    public function testEntityEvent(): void
    {
        $Entity = new Entity();

        $Collection = new EntityOneToMany($Entity);
        $Collection->setValueObject(new UserUid());
        $Entity->addCollection($Collection);

        self::assertTrue($Entity->getCollection()->count() === 1);

        /** Добавляем аналогичный элемент в коллекцию */
        $Entity->addCollection($Collection);
        self::assertTrue($Entity->getCollection()->count() === 1);


        $DTO = $Entity->getDto(DTO::class);
        self::assertTrue($DTO instanceof DTO);

        /** @var DTO $DTO */
        $DTO = $Entity->getDto($DTO);
        self::assertTrue($DTO instanceof DTO);

        self::assertEquals($DTO->getEvent(), $Entity->getId());
        self::assertEquals((string) $DTO->getEvent(), UserUid::TEST);

        /** @var DTOOneToMany $DTOOneToMany */
        $DTOOneToMany = $DTO->getCollection()->current();

        self::assertEquals((string) $DTOOneToMany->getValueObject(), (string) $Collection->getValueObject());
        self::assertEquals((string) $DTOOneToMany->getValueObject(), UserUid::TEST);
    }


    public function testEntityEventClone(): void
    {
        $Entity = new Entity();
        $Collection = new EntityOneToMany($Entity);
        $Collection->setValueObject(new UserUid());
        $Entity->addCollection($Collection);

        $Clone = $Entity->cloneEntity();


        $this->assertNotEquals($Clone->getId(), $Entity->getId());
        self::assertTrue($Clone->getCollection()->count() === 1);

        $CloneOneToMany = $Clone->getCollection()->current();

        $this->assertNotEquals((string) $CloneOneToMany, (string) $Entity);
        $this->assertEquals((string) $CloneOneToMany, (string) $Clone);

        $this->assertNotEquals($CloneOneToMany->getId(), $Collection->getId());
        $this->assertNotNull($CloneOneToMany->getValueObject());
        $this->assertEquals($CloneOneToMany->getValueObject(), $Collection->getValueObject());
        $this->assertEquals((string) $CloneOneToMany->getValueObject(), (string) new UserUid());
    }

    public function testEntityEventCloneEdit(): void
    {
        $Entity = new Entity();
        $Collection = new EntityOneToMany($Entity);
        $Collection->setValueObject(new UserUid());
        $Entity->addCollection($Collection);

        /** @var DTO $DTO */
        $DTO = $Entity->getDto(DTO::class);

        /** @var DTOOneToMany $DTOOneToMany */
        $DTOOneToMany = $DTO->getCollection()->current();
        $DTOOneToMany->setValueObject(clone(new UserUid()));


        /** @var DTO $EditDto */
        $Clone = $Entity->cloneEntity();
        $Clone->setEntity($DTO);
        $this->assertNotEquals((string) $Clone->getId(), (string) new UserUid());

        /** @var DTO $EditDto */
        $EditDto = $Clone->getDto(DTO::class);

        // отсутствует геттер в DTO - идентификатор неизменен
        $this->assertNotEquals((string) $Entity->getId(), (string) $EditDto->getEvent());
        $this->assertEquals((string) $Clone->getId(), (string) $EditDto->getEvent());

        /** @var DTOOneToMany $DTOOneToMany */
        $DTOOneToMany = $EditDto->getCollection()->current();

        $this->assertEquals((string) $DTOOneToMany->getValueObject(), (string) $Clone->getCollection()->current()->getValueObject());
        $this->assertNotEquals((string) $DTOOneToMany->getValueObject(), (string) new UserUid());
    }
}
