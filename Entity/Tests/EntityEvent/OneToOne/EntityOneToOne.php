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

namespace BaksDev\Core\Entity\Tests\EntityEvent\OneToOne;

use BaksDev\Core\Entity\EntityEvent;
use BaksDev\Users\User\Type\Id\UserUid;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

final class EntityOneToOne extends EntityEvent
{

    /** ID Entity */
    #[ORM\Id]
    #[ORM\OneToOne(targetEntity: Entity::class, inversedBy: 'o2o')]
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
