<?php
/*
 *  Copyright 2022-2025.  Baks.dev <admin@baks.dev>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is furnished
 *  to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

namespace BaksDev\Core\Entity\Tests\EntityEvent\State;

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

    /** Модификатор */
    #[ORM\OneToOne(targetEntity: EntityOneToOne::class, mappedBy: 'entity', fetch: 'EAGER')]
    private EntityOneToOne $o2o;

    public function __construct()
    {
        $this->id = new UserUid();
        $this->o2o = new EntityOneToOne($this);
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

    public function setId(UserUid $id): self
    {
        $this->id = $id;
        return $this;
    }

    /**
     * O2o
     */
    public function getO2o(): EntityOneToOne
    {
        return $this->o2o;
    }

    public function setO2o(EntityOneToOne $o2o): self
    {
        $this->o2o = $o2o;
        return $this;
    }


}
