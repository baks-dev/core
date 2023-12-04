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

use BaksDev\Users\User\Type\Id\UserUid;
use Doctrine\Common\Collections\ArrayCollection;

final class DTO
{
    /** ID  */
    private UserUid $id;

    /** Integer */
    private int $int;

    /** String */
    private string $string;

    /** String */
    private bool $bool;


    public function getEvent(): UserUid
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
