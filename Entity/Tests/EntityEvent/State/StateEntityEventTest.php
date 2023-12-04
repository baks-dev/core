<?php

namespace BaksDev\Core\Entity\Tests\EntityEvent\State;


use BaksDev\Users\User\Type\Id\UserUid;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\DependencyInjection\Attribute\When;

/**
 * @group core
 * @group core-entity-state
 */
#[When(env: 'test')]
final class StateEntityEventTest extends KernelTestCase
{
    public function EntityEvent(): void
    {
        $Entity = new Entity();
        $Entity->getO2o()->setValueObject(new UserUid());

        $DTO = $Entity->getDto(DTO::class);
        self::assertTrue($DTO instanceof DTO);

        $DTO = $Entity->getDto($DTO);
        self::assertTrue($DTO instanceof DTO);


        self::assertEquals($DTO->getEvent(), $Entity->getId());
        self::assertEquals($DTO->getEvent(), new UserUid());

        /** @var DTOOneToOne $EntityOneToOneDTO */
        $EntityOneToOneDTO = $DTO->getO2o();
        $EntityOneToOne = $Entity->getO2o();

        self::assertEquals($EntityOneToOneDTO->getValueObject(), $EntityOneToOne->getValueObject());
        self::assertEquals($EntityOneToOneDTO->getValueObject(), new UserUid());
    }



    public function testEntityEventClone(): void
    {

        $Entity = new Entity();
        $Entity->getO2o()->setValueObject(new UserUid());
        $Clone = $Entity->cloneEntity();


        // После клонирования сбрасываем идентификатор сущности
        $this->assertNotEquals($Clone->getId(), $Entity->getId());

        $EntityOneToOne = $Entity->getO2o();
        $CloneOneToOne = $Clone->getO2o();

        $this->assertEquals((string) $CloneOneToOne, (string) $Clone->getId());
        $this->assertEquals($CloneOneToOne->getValueObject(), $EntityOneToOne->getValueObject());
        $this->assertEquals($CloneOneToOne->getValueObject(), new UserUid());
    }





    public function EntityEventCloneEdit(): void
    {
        /** @var DTO $DTO */

        $Entity = new Entity();
        $Entity->getO2o()->setValueObject(new UserUid());
        $DTO = $Entity->getDto(DTO::class);
        $DTO->getO2o()->setValueObject(clone new UserUid());


        /** @var DTO $EditDto */
        $Clone = $Entity->cloneEntity();
        $Clone->setEntity($DTO);
        $this->assertNotEquals((string) $Clone->getId(), (string) new UserUid());


        $EditDto = $Clone->getDto(DTO::class);


        // отсутствует геттер в DTO - идентификатор неизменен
        $this->assertNotEquals((string) $Entity->getId(), (string) $EditDto->getEvent());
        $this->assertEquals((string) $Clone->getId(), (string) $EditDto->getEvent());

        /** @var DTO $EntityOneToOneDTO */

        $this->assertEquals((string) $EditDto->getO2o()->getValueObject(), (string) $Clone->getO2o()->getValueObject());
        $this->assertNotEquals((string) $EditDto->getO2o()->getValueObject(), (string) new UserUid());

    }
}
