<?php

namespace BaksDev\Core\Entity\Tests\EntityState\OneToMany;

use BaksDev\Users\User\Type\Id\UserUid;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\DependencyInjection\Attribute\When;

/**
 * @group core
 * @group core-entity
 */
#[When(env: 'test')]
final class OneToManyEntityStateTest extends KernelTestCase
{
    public function testEntityState(): void
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


    public function testEntityStateClone(): void
    {
        $Entity = new Entity();
        $Collection = new EntityOneToMany($Entity);
        $Collection->setValueObject(new UserUid());
        $Entity->addCollection($Collection);

        $Clone = $Entity->cloneEntity();


        $this->assertEquals($Clone->getId(), $Entity->getId());
        self::assertTrue($Clone->getCollection()->count() === 1);

        $CloneOneToMany = $Clone->getCollection()->current();

        $this->assertEquals((string) $CloneOneToMany, (string) $Entity);
        $this->assertEquals((string) $CloneOneToMany, (string) $Clone);

        $this->assertEquals($CloneOneToMany->getId(), $Collection->getId());
        $this->assertNotNull($CloneOneToMany->getValueObject());
        $this->assertEquals($CloneOneToMany->getValueObject(), $Collection->getValueObject());
        $this->assertEquals((string) $CloneOneToMany->getValueObject(), (string) new UserUid());
    }

    public function testEntityStateCloneEdit(): void
    {
        $Entity = new Entity();
        $Collection = new EntityOneToMany($Entity);
        $Collection->setValueObject(new UserUid());
        $Entity->addCollection($Collection);

        /** @var DTO $DTO */
        $DTO = $Entity->getDto(DTO::class);

        /** @var DTOOneToMany $DTOOneToMany */
        $DTOOneToMany = $DTO->getCollection()->current();
        $DTOOneToMany->setValueObject(clone new UserUid());


        /** @var DTO $EditDto */
        $EditDto = $Entity->getDto(DTO::class);
        // идентификатор неизменен
        $this->assertEquals((string) $Entity->getId(), (string) $EditDto->getEvent());

        /** @var DTOOneToMany $DTOOneToMany */
        $DTOOneToMany = $EditDto->getCollection()->current();
        $this->assertEquals((string) $DTOOneToMany->getValueObject(), (string) new UserUid());


        /** Удаляем элемент колекции */
        $EditDto->getCollection()->removeElement($DTOOneToMany);
        self::assertTrue($EditDto->getCollection()->count() === 0);

        $Entity->setEntity($EditDto);
        self::assertTrue($Entity->getCollection()->count() === 0);

    }

    public function testEntityStateDeleteAndNewCollection(): void
    {
        $Entity = new Entity();
        $Collection = new EntityOneToMany($Entity);
        $Collection->setValueObject(new UserUid());
        $Entity->addCollection($Collection);

        /** @var DTO $DTO */
        $DTO = $Entity->getDto(DTO::class);

        /** @var DTOOneToMany $DTOOneToMany */
        $DTOOneToMany = $DTO->getCollection()->current();
        $DTOOneToMany->setValueObject(clone new UserUid());


        /** @var DTO $EditDto */
        $EditDto = $Entity->getDto(DTO::class);
        // идентификатор неизменен
        self::assertEquals((string) $Entity->getId(), (string) $EditDto->getEvent());

        /** @var DTOOneToMany $DTOOneToMany */
        $DTOOneToMany = $EditDto->getCollection()->current();
        self::assertEquals((string) $DTOOneToMany->getValueObject(), (string) new UserUid());


        /** Удаляем элемент колекции */
        $EditDto->getCollection()->removeElement($DTOOneToMany);
        self::assertTrue($EditDto->getCollection()->count() === 0);


        $DTOOneToMany = new DTOOneToMany();
        $DTOOneToMany->setValueObject(clone new UserUid());
        $EditDto->addCollection($DTOOneToMany);
        self::assertTrue($EditDto->getCollection()->count() === 1);


        $Entity->setEntity($EditDto);


        $EqualsDTO = $Entity->getDto(DTO::class);
        self::assertEquals((string) $Entity->getId(), (string) $EqualsDTO->getEvent());
        self::assertTrue($EqualsDTO->getCollection()->count() === 1);

        $DTOOneToMany = $EditDto->getCollection()->current();
        self::assertNotEquals((string) $DTOOneToMany->getValueObject(), (string) new UserUid());

    }

}
