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

namespace BaksDev\Core\Tests\Entity\EntityState\DTO;

use BaksDev\Users\User\Type\Id\UserUid;
use BaksDev\Core\Tests\Entity\EntityState\Entity\Entity;

final class EntityOneToOneDTO
{
	
	public const VO_UID = '01854a9b-cd64-73bf-ab2b-c30cc24d3f8d';
	public const ENTITY_ONE_TO_ONE_READONLY_UID = '01854a9b-f10b-7e95-9ef9-5d83623b6461';
	public const ENTITY_ONE_TO_ONE_INT = 329;
	public const ENTITY_ONE_TO_ONE_STRING = 'UOzwKxuImS';
	
	

	
	/** ID Entity */
	//private Entity $entity;
	
	/** ID / ValueObject */
	private UserUid $vo;
	
	/** Readonly */
	private UserUid $readonly;
	
	/** Integer */
	private int $int;
	
	/** String */
	private string $string;
	
	
	public function __clone() : void
	{
		$this->vo = new UserUid(self::VO_UID);
		$this->readonly = new UserUid(self::ENTITY_ONE_TO_ONE_READONLY_UID);
		$this->int = self::ENTITY_ONE_TO_ONE_INT;
		$this->string = self::ENTITY_ONE_TO_ONE_STRING;
	}
	
	/**
	 * @return UserUid
	 */
	public function getVo() : UserUid
	{
		return $this->vo;
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