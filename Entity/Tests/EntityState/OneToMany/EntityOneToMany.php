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

namespace BaksDev\Core\Entity\Tests\EntityState\OneToMany;

use BaksDev\Core\Entity\EntityEvent;
use BaksDev\Core\Entity\EntityState;
use BaksDev\Users\User\Type\Id\UserUid;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

final class EntityOneToMany extends EntityState
{
    /** ID */
    #[ORM\Id]
    #[ORM\Column(type: UserUid::TYPE)]
    private UserUid $id;

    /** Связь на событие Entity */
    #[ORM\ManyToOne(targetEntity: Entity::class, inversedBy: 'o2m')]
    #[ORM\JoinColumn(name: 'event', referencedColumnName: 'id', nullable: true)]
    private ?Entity $event;

    /** ValueObject */
    #[ORM\Column(type: UserUid::TYPE)]
    private UserUid $valueObject;


    public function __construct(Entity $entity)
    {
        $this->id = new UserUid();
        $this->event = $entity;
    }

//    public function __clone(): void
//    {
//        $this->id = clone $this->id;
//    }

    public function __toString(): string
    {
        return (string) $this->event;
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
    public function getId(): UserUid
    {
        return $this->id;
    }


    /**
     * Event
     */
    public function getEvent(): ?Entity
    {
        return $this->event;
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
