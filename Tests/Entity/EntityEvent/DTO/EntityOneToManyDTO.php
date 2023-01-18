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

namespace BaksDev\Core\Tests\Entity\EntityEvent\DTO;

use App\Module\Users\User\Type\Id\UserUid;
use BaksDev\Core\Tests\Entity\EntityState\Entity\Entity;

final class EntityOneToManyDTO
{
	public const ENTITY_ONE_TO_MANY_UID = '01854a9a-5732-7ca5-b1a2-a5cd63f13bdb';
	public const ENTITY_CLONE_ONE_TO_MANY_UID = '01854a9a-5732-7ca5-b1a2-a5cd63f13bdb';
	
	public const ENTITY_ONE_TO_MANY_READONLY_UID = '01854a9a-869a-71b1-bbc3-8a11b0158cda';
	public const ENTITY_ONE_TO_MANY_INT = 934;
	public const ENTITY_ONE_TO_MANY_STRING = '6wxwXXH8gg';
	
	
	/** ID / ValueObject */
	private UserUid $id;
	
	/** Связь на событие Entity */
	//private ?Entity $entity;
	
	/** Readonly */
	private UserUid $readonly;
	
	/** Integer */
	private int $int;
	
	/** String */
	private string $string;
	
	
	public function __clone() : void
	{
		$this->id = new UserUid(self::ENTITY_CLONE_ONE_TO_MANY_UID);

		$this->readonly = new UserUid(self::ENTITY_ONE_TO_MANY_READONLY_UID);
		$this->int = self::ENTITY_ONE_TO_MANY_INT;
		$this->string = self::ENTITY_ONE_TO_MANY_STRING;
	}
	
	/**
	 * @return UserUid
	 */
	public function getEvent() : UserUid
	{
		return $this->id;
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