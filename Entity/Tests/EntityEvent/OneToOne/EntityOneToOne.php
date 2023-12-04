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

namespace BaksDev\Core\Entity\Tests\EntityEvent\OneToOne;

use BaksDev\Core\Entity\EntityEvent;
use BaksDev\Users\User\Type\Id\UserUid;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

final class EntityOneToOne extends EntityEvent
{

    /** ID Entity */
    #[ORM\Id]
    #[ORM\OneToOne(inversedBy: 'o2o', targetEntity: Entity::class)]
    #[ORM\JoinColumn(name: 'entity', referencedColumnName: 'id')]
    private Entity $id;

    /** ValueObject */
    #[ORM\Column(type: UserUid::TYPE)]
    private UserUid $valueObject;


    public function __construct(Entity $entity)
    {
        $this->id = $entity;
    }

    public function __toString(): string
    {
        return (string) $this->id;
    }

    public function getDto($dto): mixed
    {
        return parent::getDto($dto);
    }

    public function setEntity($dto): mixed
    {
        return parent::setEntity($dto);
    }

    /**
     * Id
     */
    public function getId(): Entity
    {
        return $this->id;
    }


    /**
     * ValueObject
     */
    public function getValueObject(): UserUid
    {
        return $this->valueObject;
    }

    public function setValueObject(UserUid $valueObject): self
    {
        $this->valueObject = $valueObject;
        return $this;
    }


}
