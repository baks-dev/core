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

namespace BaksDev\Core\Entity\Tests\EntityEvent\Scalar;

use BaksDev\Core\Entity\EntityEvent;
use BaksDev\Users\User\Type\Id\UserUid;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

final class Entity extends EntityEvent
{
    /** ID / ValueObject */
    #[ORM\Id]
    #[ORM\Column(type: UserUid::TYPE)]
    private UserUid $id;

    /** Integer */
    #[ORM\Column(type: Types::INTEGER)]
    private int $int;

    /** String */
    #[ORM\Column(type: Types::STRING)]
    private string $string;

    /** Bool */
    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $bool;


    public function __construct()
    {
        $this->id = new UserUid();
    }

    public function __clone(): void
    {
        $this->id = clone $this->id;
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
    public function getId(): UserUid
    {
        return $this->id;
    }

    /**
     * Int
     */
    public function getInt(): int
    {
        return $this->int;
    }

    public function setInt(int $int): self
    {
        $this->int = $int;
        return $this;
    }

    /**
     * String
     */
    public function getString(): string
    {
        return $this->string;
    }

    public function setString(string $string): self
    {
        $this->string = $string;
        return $this;
    }

    /**
     * Bool
     */
    public function getBool(): bool
    {
        return $this->bool;
    }

    public function setBool(bool $bool): self
    {
        $this->bool = $bool;
        return $this;
    }

}
