<?php
/*
 * Copyright (c) 2022.  Baks.dev <admin@baks.dev>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

namespace BaksDev\Core\Tests\Entity\EntityEvent\Entity;

use BaksDev\Users\User\Type\Id\UserUid;
use BaksDev\Core\Entity\EntityEvent;
use BaksDev\Core\Entity\EntityState;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

final class EntityOneToOne extends EntityEvent
{
	public const VO_UID = '01854a14-5448-7f0b-9b17-0663e29fe856';
	public const ENTITY_ONE_TO_ONE_READONLY_UID = '01854a15-86a2-7948-b031-1db1c35562fa';
	public const ENTITY_ONE_TO_ONE_INT = 641;
	public const ENTITY_ONE_TO_ONE_STRING = 'Q3x0C6i1jD';
	
	/** ID Entity */
	#[ORM\Id]
	#[ORM\OneToOne(inversedBy: 'o2o', targetEntity: Entity::class)]
	#[ORM\JoinColumn(name: 'entity', referencedColumnName: 'id')]
	private Entity $entity;
	
	/** ID / ValueObject */
	#[ORM\Column(type: UserUid::TYPE)]
	private UserUid $vo;
	
	/** Readonly */
	#[ORM\Column(type: UserUid::TYPE)]
	private readonly UserUid $readonly;
	
	/** Integer */
	#[ORM\Column(type: Types::INTEGER)]
	private int $int;
	
	/** String */
	#[ORM\Column(type: Types::STRING)]
	private string $string;
	
	
	public function __construct(Entity $entity)
	{
		$this->entity = $entity;
		$this->vo = new UserUid(self::VO_UID);
		$this->readonly = new UserUid(self::ENTITY_ONE_TO_ONE_READONLY_UID);
		$this->int = self::ENTITY_ONE_TO_ONE_INT;
		$this->string = self::ENTITY_ONE_TO_ONE_STRING;
	}
	
	
	public function getDto($dto) : mixed
	{
		return parent::getDto($dto);
	}
	
	
	public function setEntity($dto) : mixed
	{
		return parent::setEntity($dto);
	}
	
	
	/**
	 * @return Entity
	 */
	public function getEntity() : Entity
	{
		return $this->entity;
	}
	
	
	/**
	 * @return UserUid
	 */
	public function getVo() : UserUid
	{
		return $this->vo;
	}
	
	
	/**
	 * @return UserUid
	 */
	public function getReadonly() : UserUid
	{
		return $this->readonly;
	}
	
	
	/**
	 * @return int
	 */
	public function getInt() : int
	{
		return $this->int;
	}
	
	
	/**
	 * @return string
	 */
	public function getString() : string
	{
		return $this->string;
	}
	
}