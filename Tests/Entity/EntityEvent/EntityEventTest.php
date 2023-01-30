<?php

namespace BaksDev\Core\Tests\Entity\EntityEvent;

use BaksDev\Users\User\Type\Id\UserUid;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

final class EntityEventTest extends KernelTestCase
{
	public function testEntityEvent() : void
	{
		
		$Entity = new Entity\Entity();
		
		$DTO = new DTO\EntityDTO();
		$Entity->getDto($DTO);
		
		$this->assertEquals($DTO->getEvent(), $Entity->getId());
		$this->assertEquals($DTO->getEvent(), new UserUid($Entity::ENTITY_UID));
		
		$this->assertEquals($DTO->getReadonly(), $Entity->getReadonly());
		$this->assertEquals($DTO->getReadonly(), new UserUid($Entity::ENTITY_READONLY_UID));
		
		$this->assertEquals($DTO->getInt(), $Entity->getInt());
		$this->assertEquals($DTO->getInt(), $Entity::ENTITY_INT);
		
		$this->assertEquals($DTO->getString(), $Entity->getString());
		$this->assertEquals($DTO->getString(), $Entity::ENTITY_STRING);
		
		/** @var $EntityOneToManyDTO DTO\EntityOneToManyDTO
		 * @var $EntityOneToMany Entity\EntityOneToMany
		 */
		$EntityOneToManyDTO = $DTO->getO2m()[0];
		$EntityOneToMany = $Entity->getO2m()[0];
		
		$this->assertEquals($EntityOneToManyDTO->getEvent(), $EntityOneToMany->getId());
		$this->assertEquals($EntityOneToManyDTO->getEvent(), new UserUid($EntityOneToMany::ENTITY_ONE_TO_MANY_UID));
		
		$this->assertEquals($EntityOneToManyDTO->getReadonly(), $EntityOneToMany->getReadonly());
		$this->assertEquals($EntityOneToManyDTO->getReadonly(),
			new UserUid($EntityOneToMany::ENTITY_ONE_TO_MANY_READONLY_UID)
		);
		
		$this->assertEquals($EntityOneToManyDTO->getInt(), $EntityOneToMany->getInt());
		$this->assertEquals($EntityOneToManyDTO->getInt(), $EntityOneToMany::ENTITY_ONE_TO_MANY_INT);
		
		$this->assertEquals($EntityOneToManyDTO->getString(), $EntityOneToMany->getString());
		$this->assertEquals($EntityOneToManyDTO->getString(), $EntityOneToMany::ENTITY_ONE_TO_MANY_STRING);
		
		/** @var $EntityOneToOneDTO DTO\EntityOneToOneDTO */
		$EntityOneToOneDTO = $DTO->getO2o();
		$EntityOneToOne = $Entity->getO2o();
		
		$this->assertEquals($EntityOneToOneDTO->getInt(), $EntityOneToOne->getInt());
		$this->assertEquals($EntityOneToOneDTO->getInt(), $EntityOneToOne::ENTITY_ONE_TO_ONE_INT);
		
		$this->assertEquals($EntityOneToOneDTO->getString(), $EntityOneToOne->getString());
		$this->assertEquals($EntityOneToOneDTO->getString(), $EntityOneToOne::ENTITY_ONE_TO_ONE_STRING);
		
		$this->assertEquals($EntityOneToOneDTO->getVo(), $EntityOneToOne->getVo());
		$this->assertEquals($EntityOneToOneDTO->getVo(), new UserUid($EntityOneToOne::VO_UID));
		
		//$this->assertEmpty($Entity->getRemoveEntity());
		
	}
	
	
	public function testEntityEventClone() : void
	{
		//dd(new UserUid());
		
		$TempEntity = new Entity\Entity();
		/* @var  $Entity Entity\Entity */
		$Entity = $TempEntity->cloneEntity();
		
		/* После клонирования сбрасываем идентификатор сущности */
		$this->assertNotEquals($Entity->getId(), $TempEntity->getId());
		$this->assertEquals($Entity->getId(), new UserUid($TempEntity::ENTITY_CLONE_UID));
		
		$this->assertEquals($Entity->getReadonly(), $TempEntity->getReadonly());
		$this->assertEquals($Entity->getReadonly(), new UserUid($TempEntity::ENTITY_READONLY_UID));
		
		$this->assertEquals($Entity->getInt(), $TempEntity->getInt());
		$this->assertEquals($Entity->getInt(), $TempEntity::ENTITY_INT);
		
		$this->assertEquals($Entity->getString(), $TempEntity->getString());
		$this->assertEquals($Entity->getString(), $TempEntity::ENTITY_STRING);
		
		/** @var $EntityOneToMany Entity\EntityOneToMany
		 * @var $EntityOneToManyClone Entity\EntityOneToMany
		 */
		$EntityOneToMany = $Entity->getO2m()[0];
		$EntityOneToManyClone = $TempEntity->getO2m()[0];
		
		/* После клонирования сбрасываем идентификатор сущности */
		$this->assertNotEquals($EntityOneToManyClone->getId(), $EntityOneToMany->getId());
		$this->assertEquals($EntityOneToManyClone->getId(), new UserUid($EntityOneToMany::ENTITY_ONE_TO_MANY_UID));
		
		$this->assertEquals($EntityOneToManyClone->getReadonly(), $EntityOneToMany->getReadonly());
		$this->assertEquals($EntityOneToManyClone->getReadonly(),
			new UserUid($EntityOneToMany::ENTITY_ONE_TO_MANY_READONLY_UID)
		);
		
		$this->assertEquals($EntityOneToManyClone->getInt(), $EntityOneToMany->getInt());
		$this->assertEquals($EntityOneToManyClone->getInt(), $EntityOneToMany::ENTITY_ONE_TO_MANY_INT);
		
		$this->assertEquals($EntityOneToManyClone->getString(), $EntityOneToMany->getString());
		$this->assertEquals($EntityOneToManyClone->getString(), $EntityOneToMany::ENTITY_ONE_TO_MANY_STRING);
		
		/** @var $EntityOneToOneDTO DTO\EntityOneToOneDTO */
		$EntityOneToOne = $TempEntity->getO2o();
		$EntityOneToOneClone = $Entity->getO2o();
		
		$this->assertEquals($EntityOneToOneClone->getInt(), $EntityOneToOne->getInt());
		$this->assertEquals($EntityOneToOneClone->getInt(), $EntityOneToOne::ENTITY_ONE_TO_ONE_INT);
		
		$this->assertEquals($EntityOneToOneClone->getString(), $EntityOneToOne->getString());
		$this->assertEquals($EntityOneToOneClone->getString(), $EntityOneToOne::ENTITY_ONE_TO_ONE_STRING);
		
		$this->assertEquals($EntityOneToOneClone->getVo(), $EntityOneToOne->getVo());
		$this->assertEquals($EntityOneToOneClone->getVo(), new UserUid($EntityOneToOne::VO_UID));
		
	}
	
	
	public function testEntityEventCloneEdit() : void
	{
		$TempEntity = new Entity\Entity();
		
		/* Мапим DTO */
		$TempDTO = new DTO\EntityDTO();
		$TempEntity->getDto($TempDTO);
		
		/* клонируем DTO и мапим сущность */
		/* @var  $Entity Entity\Entity */
		$Entity = $TempEntity->cloneEntity();
		$DTO = clone $TempDTO;
		
		/* Мапим на сущность */
		$Entity->setEntity($DTO);
		
		/* отсутствует геттер в DTO - идентификатор неизменен */
		$this->assertNotEquals($Entity->getId(), $DTO->getEvent());
		/* После клонирвоания идентификатор всегда меняется */
		$this->assertNotEquals($Entity->getId(), $TempEntity->getId());
		/* При мапинге DTO на сущность идентификатор неизменен и равен клонируемому */
		$this->assertEquals($Entity->getId(), new UserUid($Entity::ENTITY_CLONE_UID));
		
		/* свойство Readonly всегда неизменно */
		$this->assertNotEquals($Entity->getReadonly(), $DTO->getReadonly());
		$this->assertEquals($Entity->getReadonly(), new UserUid($Entity::ENTITY_READONLY_UID));
		
		//dd($DTO->getInt());
		
		$this->assertEquals($Entity->getInt(), $DTO->getInt());
		$this->assertEquals($Entity->getInt(), $DTO::ENTITY_INT);
		
		$this->assertEquals($Entity->getString(), $DTO->getString());
		$this->assertEquals($Entity->getString(), $DTO::ENTITY_STRING);
		
		/** @var $EntityOneToManyDTO DTO\EntityOneToManyDTO
		 * @var $EntityOneToMany Entity\EntityOneToMany
		 */
		$EntityOneToManyDTO = $DTO->getO2m()[0];
		$EntityOneToMany = $Entity->getO2m()[0];
		
		/* отсутствует геттер в DTO - идентификатор неизменен */
		$this->assertNotEquals($EntityOneToMany->getid(), $EntityOneToManyDTO->getEvent());
		/* После клонирвоания идентификатор всегда меняется */
		$this->assertNotEquals($EntityOneToMany->getId(), $TempEntity::ENTITY_UID);
		
		$this->assertNotEquals($EntityOneToManyDTO->getEvent(), new UserUid($EntityOneToMany::ENTITY_ONE_TO_MANY_UID));
		
		/* Readonly всегда неизменен, если инициирован */
		$this->assertNotEquals($EntityOneToMany->getReadonly(), $EntityOneToManyDTO->getReadonly());
		$this->assertEquals($EntityOneToMany->getReadonly(),
			new UserUid($EntityOneToMany::ENTITY_ONE_TO_MANY_READONLY_UID)
		);
		
		$this->assertEquals($EntityOneToMany->getInt(), $EntityOneToManyDTO->getInt());
		$this->assertEquals($EntityOneToMany->getInt(), $EntityOneToManyDTO::ENTITY_ONE_TO_MANY_INT);
		
		$this->assertEquals($EntityOneToMany->getString(), $EntityOneToManyDTO->getString());
		$this->assertEquals($EntityOneToMany->getString(), $EntityOneToManyDTO::ENTITY_ONE_TO_MANY_STRING);
		
		/** @var $EntityOneToOneDTO DTO\EntityOneToOneDTO */
		$EntityOneToOneDTO = $DTO->getO2o();
		$EntityOneToOne = $Entity->getO2o();
		
		$this->assertEquals($EntityOneToOne->getInt(), $EntityOneToOneDTO->getInt());
		$this->assertEquals($EntityOneToOne->getInt(), $EntityOneToOneDTO::ENTITY_ONE_TO_ONE_INT);
		
		$this->assertEquals($EntityOneToOne->getString(), $EntityOneToOneDTO->getString());
		$this->assertEquals($EntityOneToOne->getString(), $EntityOneToOneDTO::ENTITY_ONE_TO_ONE_STRING);
		
		$this->assertEquals($EntityOneToOne->getVo(), $EntityOneToOneDTO->getVo());
		$this->assertEquals($EntityOneToOne->getVo(), new UserUid($EntityOneToOneDTO::VO_UID));
		
	}
	
}