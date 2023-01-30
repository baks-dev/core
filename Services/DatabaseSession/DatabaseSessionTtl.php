<?php
/*
 *  Copyright 2022.  Baks.dev <admin@baks.dev>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

namespace BaksDev\Core\Services\DatabaseSession;

use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Security;

final class DatabaseSessionTtl
{
	private AuthorizationCheckerInterface $security;
	
	
	public function __construct(AuthorizationCheckerInterface $security)
	{
		$this->security = $security;
	}
	
	
	public function __invoke() : int
	{
		if($this->security->isGranted('ROLE_ADMIN'))
		{
			return 604800; // 7 дней
		}
		
		return 54000; // 15 часов
	}
	
}