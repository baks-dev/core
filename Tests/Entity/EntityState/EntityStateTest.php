<?php

namespace BaksDev\Core\Tests\Entity\EntityState;

use App\Module\Users\User\Type\Id\UserUid;

use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

final class EntityStateTest extends KernelTestCase
{
	public function testEntityState() : void
	{
		
		$Entity = new Entity\Entity();
		
		$DTO = new DTO\EntityDTO();
		$Entity->getDto($DTO);
		
		$this->assertEquals($DTO->getId(), $Entity->getId());
		$this->assertEquals($DTO->getId(), new UserUid($Entity::ENTITY_UID));
		
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
		
		$this->assertEquals($EntityOneToManyDTO->getId(), $EntityOneToMany->getId());
		$this->assertEquals($EntityOneToManyDTO->getId(), new UserUid($EntityOneToMany::ENTITY_ONE_TO_MANY_UID));
		
		$this->assertEquals($EntityOneToManyDTO->getReadonly(), $EntityOneToMany->getReadonly());
		$this->assertEquals($EntityOneToManyDTO->getReadonly(), new UserUid($EntityOneToMany::ENTITY_ONE_TO_MANY_READONLY_UID));
		
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
		
		$this->assertEmpty($Entity->getRemoveEntity());
	}
	
	
	public function testEntityStateEdit() : void
	{
		$Entity = new Entity\Entity();

		$TempDTO = new DTO\EntityDTO();
		$Entity->getDto($TempDTO);
		
		$DTO = clone $TempDTO;
		
		$Entity->setEntity($DTO);
		
		/* Идентификаторы в статических сущностях неизменны   */
		$this->assertNotEquals($Entity->getId(), $DTO->getId());
		$this->assertEquals($Entity->getId(), new UserUid($Entity::ENTITY_UID));
		
		/* Неизменяемое свойство Readonly */
		$this->assertNotEquals($Entity->getReadonly(), $DTO->getReadonly());
		$this->assertEquals($Entity->getReadonly(), new UserUid($Entity::ENTITY_READONLY_UID));
		
		$this->assertEquals($Entity->getInt(), $DTO->getInt());
		$this->assertEquals($Entity->getInt(), $DTO::ENTITY_INT);
		
		$this->assertEquals($Entity->getString(), $DTO->getString());
		$this->assertEquals($Entity->getString(), $DTO::ENTITY_STRING);
		
		
		/** @var $EntityOneToManyDTO DTO\EntityOneToManyDTO
		 * @var $EntityOneToMany Entity\EntityOneToMany
		 */
		$EntityOneToManyDTO = $DTO->getO2m()[0];
		$EntityOneToMany = $Entity->getO2m()[1];
		
		
		/* Идентификаторы в статических сущностях неизменны   */
		$this->assertNotEquals($EntityOneToMany->getId(), $EntityOneToManyDTO->getId());
		$this->assertEquals($EntityOneToMany->getId(), new UserUid($EntityOneToMany::ENTITY_ONE_TO_MANY_UID));
		
		/* Неизменяемое свойство Readonly */
		$this->assertNotEquals($EntityOneToMany->getReadonly(), $EntityOneToManyDTO->getReadonly());
		$this->assertEquals($EntityOneToMany->getReadonly(), new UserUid($EntityOneToMany::ENTITY_ONE_TO_MANY_READONLY_UID));
		
		$this->assertEquals($EntityOneToMany->getInt(), $EntityOneToManyDTO->getInt());
		$this->assertEquals($EntityOneToMany->getInt(), $EntityOneToManyDTO::ENTITY_ONE_TO_MANY_INT);

		$this->assertEquals($EntityOneToMany->getString(), $EntityOneToManyDTO->getString());
		$this->assertEquals($EntityOneToMany->getString(), $EntityOneToManyDTO::ENTITY_ONE_TO_MANY_STRING);
		
		
		/** @var $EntityOneToOneDTO DTO\EntityOneToOneDTO
		 *  @var $EntityOneToOneDTO Entity\EntityOneToOne
		 */
		$EntityOneToOneDTO = $DTO->getO2o();
		$EntityOneToOne = $Entity->getO2o();
		
		/* Неизменяемое свойство Readonly */
		$this->assertNotEquals($EntityOneToOne->getReadonly(), $EntityOneToOneDTO->getReadonly());
		$this->assertEquals($EntityOneToOne->getReadonly(), new UserUid($EntityOneToOne::ENTITY_ONE_TO_ONE_READONLY_UID));
		
		$this->assertEquals($EntityOneToOne->getInt(), $EntityOneToOneDTO->getInt());
		$this->assertEquals($EntityOneToOne->getInt(), $EntityOneToOneDTO::ENTITY_ONE_TO_ONE_INT);
		
		$this->assertEquals($EntityOneToOne->getString(), $EntityOneToOneDTO->getString());
		$this->assertEquals($EntityOneToOne->getString(), $EntityOneToOneDTO::ENTITY_ONE_TO_ONE_STRING);
		
		$this->assertEquals($EntityOneToOne->getVo(), $EntityOneToOneDTO->getVo());
		$this->assertEquals($EntityOneToOne->getVo(), new UserUid($EntityOneToOneDTO::VO_UID));
		
		
		$this->assertInstanceOf(ArrayCollection::class, $Entity->getRemoveEntity());
		$this->assertEquals(1, $Entity->getRemoveEntity()->count());
		$this->assertInstanceOf(Entity\EntityOneToMany::class, $Entity->getRemoveEntity()->get(0));

	}
}