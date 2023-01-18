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

use App\Module\Users\User\Type\Id\UserUid;
use BaksDev\Core\Entity\EntityEvent;
use BaksDev\Core\Entity\EntityState;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

final class EntityOneToMany extends EntityEvent
{
	public const ENTITY_ONE_TO_MANY_UID = '01854a12-4c83-7af9-965c-b55a19d8465a';
	public const ENTITY_CLONE_ONE_TO_MANY_UID = '01855084-7adf-7b74-919a-93ee98741a4e';
	
	public const ENTITY_ONE_TO_MANY_READONLY_UID = '01854a1b-9216-7726-ad1e-f011b05ca086';
	public const ENTITY_ONE_TO_MANY_INT = 856;
	public const ENTITY_ONE_TO_MANY_STRING = '278ll6xC8n';
	
	
	
	/** ID / ValueObject */
	#[ORM\Id]
	#[ORM\Column(type: UserUid::TYPE)]
	private UserUid $id;
	
	/** Связь на событие Entity */
	#[ORM\ManyToOne(targetEntity: Entity::class, inversedBy: "o2m")]
	#[ORM\JoinColumn(name: 'entity', referencedColumnName: "id", nullable: true)]
	private ?Entity $entity;
	
	
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
		$this->id = new UserUid(self::ENTITY_ONE_TO_MANY_UID);
		$this->entity = $entity;
		
		$this->readonly = new UserUid(self::ENTITY_ONE_TO_MANY_READONLY_UID);
		$this->int = self::ENTITY_ONE_TO_MANY_INT;
		$this->string = self::ENTITY_ONE_TO_MANY_STRING;
		
	}
	
	public function __clone() : void
	{
		$this->id = new UserUid(self::ENTITY_CLONE_ONE_TO_MANY_UID);
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
	 * @return UserUid
	 */
	public function getId() : UserUid
	{
		return $this->id;
	}
	
	/**
	 * @return Entity|null
	 */
	public function getEntity() : ?Entity
	{
		return $this->entity;
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