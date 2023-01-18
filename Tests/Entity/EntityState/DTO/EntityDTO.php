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

namespace App\System\Tests\Entity\EntityState\DTO;

use App\Module\Users\User\Type\Id\UserUid;
use App\System\Tests\Entity\EntityState\Entity\EntityOneToMany;
use App\System\Tests\Entity\EntityState\Entity\EntityOneToOne;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;

final class EntityDTO
{
	
	public const ENTITY_UID = '01854a93-3191-7897-b19c-370e7ad729b4';
	
	public const ENTITY_READONLY_UID = '01854a93-70a6-740a-ad8c-e31287c08691';
	public const ENTITY_INT = 102;
	public const ENTITY_STRING = '56jBD36pLl';
	
	
	/** ID / ValueObject */
	private UserUid $id;
	
	/** OneToMany */
	private ArrayCollection $o2m;
	
	/** Модификатор */
	private EntityOneToOneDTO $o2o;
	
	/** Readonly */
	private UserUid $readonly;
	
	/** Integer */
	private int $int;
	
	/** String */
	private string $string;
	
	public function __construct(){
		
		$this->o2m = new ArrayCollection();
		$this->o2o = new EntityOneToOneDTO();
	}
	
	public function __clone() : void
	{
		$this->id = new UserUid(self::ENTITY_UID);
		$this->readonly = new UserUid(self::ENTITY_UID);
		$this->int = self::ENTITY_INT;
		$this->string = self::ENTITY_STRING;
		
		$cloneO2m = clone $this->o2m->get(0);
		
		$this->o2m = new ArrayCollection();
		$this->o2m->add($cloneO2m);
		
		$cloneO2o = clone $this->o2o;
		$this->o2o = $cloneO2o;
	}
	
	/**
	 * @return UserUid
	 */
	public function getId() : UserUid
	{
		return $this->id;
	}
	
	
	/**
	 * @return ArrayCollection
	 */
	public function getO2m() : ArrayCollection
	{
		return $this->o2m;
	}
	
	/**
	 * @param ArrayCollection $o2m
	 */
	public function addO2m(EntityOneToManyDTO $o2m) : void
	{
		$this->o2m->add($o2m);
	}
	
	/**
	 * @return EntityOneToOneDTO
	 */
	public function getO2o() : EntityOneToOneDTO
	{
		return $this->o2o;
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