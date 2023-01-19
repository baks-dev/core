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

namespace BaksDev\Core\Tests\Entity\EntityState\Entity;

use BaksDev\Users\User\Type\Id\UserUid;
use BaksDev\Core\Entity\EntityState;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

final class Entity extends EntityState
{
	public const ENTITY_UID = '01854a13-784c-788e-a48c-e2626af250ee';
	
	public const ENTITY_READONLY_UID = '01854a1d-d495-7e9f-9eb7-d5f174105457';
	public const ENTITY_INT = 667;
	public const ENTITY_STRING = '4RU1oDlFts';
	
	
	
	/** ID / ValueObject */
	#[ORM\Id]
	#[ORM\Column(type: UserUid::TYPE)]
	private readonly UserUid $id;
	
	/** OneToMany */
	#[ORM\OneToMany(mappedBy: 'entity', targetEntity: EntityOneToMany::class)]
	private Collection $o2m;
	
	/** Модификатор */
	#[ORM\OneToOne(mappedBy: 'entity', targetEntity: EntityOneToOne::class)]
	private EntityOneToOne $o2o;
	
	/** Readonly */
	#[ORM\Column(type: UserUid::TYPE)]
	private readonly UserUid $readonly;
	
	/** Integer */
	#[ORM\Column(type: Types::INTEGER)]
	private int $int;
	
	/** String */
	#[ORM\Column(type: Types::STRING)]
	private string $string;
	
	
	public function __construct()
	{
		$this->id = new UserUid(self::ENTITY_UID);
		
		$this->readonly = new UserUid(self::ENTITY_READONLY_UID);
		$this->int = self::ENTITY_INT;
		$this->string = self::ENTITY_STRING;
		
		$this->o2m = new ArrayCollection();
		$this->o2m->add(new EntityOneToMany($this));
		
		$this->o2o = new EntityOneToOne($this);
		
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
	 * @return Collection
	 */
	public function getO2m() : Collection
	{
		return $this->o2m;
	}
	
	/**
	 * @return EntityOneToOne
	 */
	public function getO2o() : EntityOneToOne
	{
		return $this->o2o;
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
	
	/**
	 * @return UserUid
	 */
	public function getReadonly() : UserUid
	{
		return $this->readonly;
	}
	

	
	
	
	
}