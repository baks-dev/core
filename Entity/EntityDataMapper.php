<?php
/*
 *  Copyright 2025.  Baks.dev <admin@baks.dev>
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

declare(strict_types=1);

namespace BaksDev\Core\Entity;

use Closure;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use InvalidArgumentException;
use ReflectionAttribute;
use ReflectionClass;
use ReflectionProperty;
use ReflectionUnionType;

abstract class EntityDataMapper
{
    private object|false $dto = false;


    private ?EntityManagerInterface $entityManager = null;

    private ?EntityManagerInterface $removeEntityManager = null;

    /**
     * Метод возвращает присваиваемую DTO к сущности
     */
    public function getEntityDto(): object|false
    {
        return $this->dto;
    }

    public function getDto(object|string $dto): mixed
    {
        $dtoReflectionClass = new DtoReflection($dto);
        $dto = $dtoReflectionClass->getDto();

        foreach($dtoReflectionClass->getProperties() as $property)
        {
            $dtoReflectionClass->setReflectionProperty($property);
            $propertyName = $dtoReflectionClass->getPropertyName();

            // Если в сущности нет одноименного свойства - continue
            if(!property_exists($this, $propertyName))
            {
                continue;
            }

            /** Пропускаем, если одноименное свойство в сущности не инициировано */
            $getEntityProperty = $this->getPropertyValue($propertyName, $this);

            if($getEntityProperty === 'not_initialized')
            {
                continue;
            }

            $propertyTypeName = $dtoReflectionClass->getPropertyTypeName();
            $propertyMethodName = $dtoReflectionClass->getPropertyMethodName();
            $type = $dtoReflectionClass->getPropertyInstanceType();


            /** Если тип свойства коллекция */
            if($type instanceof Collection)
            {
                $addDtoMethod = $dtoReflectionClass->getMethodAdder();

                if($addDtoMethod)
                {
                    //                    // Получаем значение свойств сущности
                    //                    /** @var PersistentCollection $getEntityProperty */
                    //                    $getEntityProperty = $this->getPropertyValue($propertyName, $this);

                    /* Получаем тип объекта коллекции по typehint */
                    $collectionClass = $dtoReflectionClass->getTypeParameterMethod($addDtoMethod);

                    // Проходимся по всей коллекции сущности и заполняем DTO
                    foreach($getEntityProperty as $entityCollection)
                    {
                        $collectionInstance = new $collectionClass();

                        if(method_exists($dto, $addDtoMethod))
                        {
                            // Заполняем DTO из коллекции значениями из сущности добавляем в коллекцию
                            $dataCollectionDto = $entityCollection->getDto($collectionInstance);
                            $dto->{$addDtoMethod}($dataCollectionDto);
                        }
                    }
                }

                continue;
            }


            // Если тип свойства - класс
            if($type !== false)
            {
                /** если определена константа TYPE - класс ValueObject Doctrine Type */
                if($dtoReflectionClass->hasConstant('TYPE'))
                {
                    /* Если значение не NULL - инициируем ValueObject и передаем в конструктор значение  */
                    if($getEntityProperty !== null)
                    {
                        $valueObject = new $propertyTypeName($getEntityProperty);
                        $this->setPropertyValue($propertyName, $valueObject, $dto);
                        continue;
                    }

                    $this->setPropertyValue($propertyName, $getEntityProperty, $dto);
                    continue;
                }


                /** Если связь OneToOne */
                $modifiers = new ReflectionProperty($this, $propertyName);
                $attr = $modifiers->getAttributes(ORM\OneToOne::class);
                $OneToOneAttribute = current($attr);

                if($OneToOneAttribute)
                {
                    $oneToOne = new $propertyTypeName();

                    if($oneToOne)
                    {
                        $dataOneToOneDto = null;

                        if($getEntityProperty)
                        {
                            $dataOneToOneDto = $getEntityProperty->getDto($oneToOne);
                        }

                        $this->setPropertyValue($propertyName, $dataOneToOneDto, $dto);

                        continue;
                    }
                }
            }


            /**
             * Если свойство скалярное или ManyToOne присваиваем как есть
             */

            $getEntityPropertyValue = $this->getPropertyValue($propertyName, $this);


            /** Если имеется WITH - присваиваем через метод */
            if($withDtoMethod = $dtoReflectionClass->getMethodWither())
            {

                $dto->{$withDtoMethod}($getEntityPropertyValue);
            }

            /** Если имеется сеттер - присваиваем через метод */
            elseif($setterDtoMethod = $dtoReflectionClass->getMethodSetter())
            {
                /** Проверяем, что сеттер принимает тип
                 * Если свойство является объектом, сеттер принимает класс, но их типы не равны - пропускаем  */
                if(is_object($getEntityPropertyValue) && class_exists($dtoReflectionClass->getPropertyTypeName()) && !$getEntityPropertyValue instanceof $type)
                {
                    continue;
                }

                $dto->{$setterDtoMethod}($getEntityPropertyValue);

            }
            else
            {


                /* Присваиваем значение через замыкание */
                $this->setPropertyValue($propertyName, $getEntityPropertyValue, $dto);
            }

        }

        return $dto;
    }


    /**
     * Мотод обновляет одноименные свойства сущности из DTO при выполнении условий:
     * 1. DTO должна иметь геттер одноименного свойтсва свойства
     */
    public function setEntity($dto): mixed
    {

        //        if($this->remove === null)
        //        {
        //            $this->remove = new ArrayCollection();
        //        }
        $this->dto = $dto;

        $oReflectionClass = new DtoReflection($dto);

        // Перебор всех свойств, имеющихся в DTO
        foreach($oReflectionClass->getProperties() as $property)
        {
            // Проверяем, имеется ли метод маппинга
            $propertyName = $property->getName();

            if($dto instanceof $this)
            {
                $value = $this->getPropertyValue($propertyName, $dto);
                $this->setPropertyValue($propertyName, $value, $this);
                continue;
            }

            // Пропускаем свойства, которых нет в сущности или DTO
            if(!property_exists($this, $propertyName) || !property_exists($dto, $propertyName))
            {
                continue;
            }

            $dtoReflectionPropertyByName = new ReflectionProperty($dto, $propertyName);

            // Если свойство в DTO не инициировано - пропускаем
            if($dtoReflectionPropertyByName->isInitialized($dto) === false)
            {
                continue;
            }

            $entityReflectionPropertyByName = new ReflectionProperty($this, $propertyName);


            /**
             * Если нужно выполнить преобразование значения свойства DTO - должен быть объявлен геттер
             */
            $propertyMethodName = ucfirst($property->getName());
            $getDtoMethod = 'get'.$propertyMethodName;

            if(method_exists($dto, $getDtoMethod))
            {
                // Вызываем геттер, в случае если в геттере что-либо вызывается логика
                $dto->{$getDtoMethod}();
            }

            /**
             * Из рефлексии получаем typehint
             */

            $ReflectionType = $property->getType();

            // если typehint union (множественный) - выбираем всегда current (первый элемент)
            if($ReflectionType instanceof ReflectionUnionType)
            {
                $ReflectionType = current($ReflectionType->getTypes());
            }


            $type = null;

            // Если тайпхинт свойства - класс, инициируем мимо конструктора
            if(class_exists($ReflectionType->getName()))
            {
                $instanceClass = new ReflectionClass($ReflectionType->getName());

                // Если класс Enum
                if($instanceClass->isEnum())
                {
                    $type = $instanceClass->getName();
                }
                else
                {
                    $type = $instanceClass->newInstanceWithoutConstructor();
                }
            }


            if($type instanceof Collection)
            {
                // Если в сущности имеется одноименное свойство сущности
                if(property_exists($this, $propertyName) && method_exists($dto, $getDtoMethod))
                {
                    // $entityReflectionPropertyByName = new ReflectionProperty($this, $propertyName);
                    $o2m = $entityReflectionPropertyByName->getAttributes(ORM\OneToMany::class);

                    if($o2m)
                    {
                        $o2oTargetEntity = current($o2m)->getArguments()['targetEntity'];


                        /* Если в сущности не инициировано свойство коллекции - инициируем ArrayCollection */
                        if((new ReflectionProperty($this, $propertyName))->isInitialized($this) === false)
                        {
                            $this->setPropertyValue($propertyName, new ArrayCollection(), $this);
                        }

                        $entityCollections = $this->getPropertyValue($propertyName, $this);

                        // Получаем коллекцию DTO
                        $dtoCollections = $this->getPropertyValue($propertyName, $dto); // $dto->$getDtoMethod();

                        /** Если сущность клонируется или коллекция пуста */
                        if($entityCollections->current() instanceof EntityEvent || $entityCollections->isEmpty())
                        {

                            $entityCollections = new ArrayCollection();
                            $this->setPropertyValue($propertyName, $entityCollections, $this);

                            foreach($dtoCollections as $value)
                            {
                                $obj = new $o2oTargetEntity($this);
                                $obj->setEntityManager($this->entityManager);
                                $return = $obj->setEntity($value);

                                if($return === false)
                                {
                                    $obj = null;
                                    continue;
                                }

                                // Добавляем объект в коллецию
                                $entityCollections->add($obj);
                            }

                        }

                        /** Если сущность статическая */
                        else
                        {

                            if(is_null($this->entityManager))
                            {
                                $thisReflectionClass = new ReflectionClass($this);
                                $isClassEntity = $thisReflectionClass->getAttributes(ORM\Entity::class);

                                if(!empty($isClassEntity))
                                {
                                    throw new InvalidArgumentException('Необходимо передать в сущность EntityManager методом ->setEntityManager($this->entityManager)');
                                }
                            }

                            $currentCollections = $entityCollections->current();


                            /**
                             * Получаем свойства сущности, которые являются идентификаторами
                             */
                            $collectionReflectionClass = new ReflectionClass($currentCollections);

                            $identifier = [];

                            foreach($collectionReflectionClass->getProperties() as $propertyCollection)
                            {
                                /** @var ReflectionAttribute $Attr */
                                $Attr = $propertyCollection->getAttributes(ORM\Id::class);

                                if($Attr)
                                {
                                    $identifier[] = $propertyCollection->getName();
                                }
                            }

                            /** Удаляем сущности, которые были удалены из коллекции */

                            /** @var PersistentCollection $entityElement */
                            foreach($entityCollections as $entityElement)
                            {
                                $removeEntityElement = $this->findRemoveElement($entityElement, $dtoCollections, $identifier);

                                if($removeEntityElement !== false)
                                {

                                    $removeEntityManager = $this->removeEntityManager ?: clone $this->entityManager;
                                    $removeEntityManager->remove($entityElement);
                                    //$this->entityManager?->remove($entityElement);

                                    $entityCollections->removeElement($entityElement);
                                }
                            }


                            /** Обновляем существующие (добавляем новые) элементы коллекции */

                            /** @var EntityState $entityCollection */
                            foreach($dtoCollections as $dtoElement)
                            {
                                $updateEntityElement = $this->findUpdateOrCreateElement($dtoElement, $entityCollections, $identifier);

                                /** Обновляем элемент */
                                if($updateEntityElement !== false)
                                {
                                    $updateEntityElement->setEntityManager($this->entityManager);
                                    $updateEntityElement->setEntity($dtoElement);

                                }

                                /** Добавляем новый элемент */
                                else
                                {
                                    $obj = new $o2oTargetEntity($this);
                                    $obj->setEntityManager($this->entityManager);
                                    $obj->setEntity($dtoElement);
                                    $entityCollections->add($obj);
                                }
                            }
                        }

                    }

                    continue;
                }
            }


            /*
                Если односторонняя связь на сущность или кастомный тип
            */
            if(class_exists($ReflectionType->getName()) && property_exists($this, $propertyName))
            {
                $o2o = $entityReflectionPropertyByName->getAttributes(ORM\OneToOne::class);


                if($o2o)
                {
                    /** Получаем из аттрибута Target класс сущности */
                    $o2oTargetEntity = current($o2o)->getArguments()['targetEntity'];
                    // $getDtoMethod = 'get'.$propertyMethodName;

                    if(method_exists($dto, $getDtoMethod))
                    {
                        // Вызываем геттер, в случае если в геттере что либо вызывается логика
                        // и сравниваем что он не возвращает NULL
                        if($dto->{$getDtoMethod}() !== null)
                        {
                            /** Если свойство не инициировано - создаем инстанс класса TargetEntity */
                            if($entityReflectionPropertyByName->isInitialized($this) === false)
                            {
                                $this->setPropertyValue($propertyName, new $o2oTargetEntity($this), $this);
                            }

                            $thisProperty = $this->getPropertyValue($propertyName, $this);

                            $setPropertyNull = false;

                            // Инициируем объект если NULL
                            if($thisProperty === null)
                            {
                                $this->setPropertyValue($propertyName, new $o2oTargetEntity($this), $this);
                                $thisProperty = $this->getPropertyValue($propertyName, $this);
                                $setPropertyNull = true;
                            }

                            if($thisProperty && method_exists($thisProperty, 'setEntity'))
                            {
                                $thisProperty->setEntityManager($this->entityManager);
                                $return = $thisProperty->setEntity($dto->{$getDtoMethod}());

                                // - if($return === false && $setPropertyNull === true)
                                // + if($return === false)

                                /** Если при связи OneToOne метод setEntity возвращает FALSE - не присваиваем объект */
                                if($return === false)
                                {
                                    // Снова присваиваем NULL
                                    $this->setPropertyValue($propertyName, null, $this);

                                    $this->entityManager?->detach($thisProperty);

                                }
                            }
                        }
                        else
                        {

                            $thisProperty = $this->getPropertyValue($propertyName, $this);

                            /**
                             * Если метод геттера DTO возвращает NULL - пробуем присвоить свойству сущности
                             * если свойство сущности не принимает NULL - свойство останется неизменным
                             */
                            $isSetPropertyNull = $this->setPropertyValue($propertyName, null, $this);

                            /** Если свойство допускает присваивание NULL - удаляем Target объект */
                            if($isSetPropertyNull && is_object($thisProperty))
                            {
                                $this->entityManager?->remove($thisProperty);
                            }

                        }
                    }

                    continue;
                }
            }

            // Если обычное свойство
            if(property_exists($this, $propertyName) && method_exists($dto, $getDtoMethod))
            {
                // Если свойство сущности ReadOnly и оно уже инициировано - не присваиваем
                if(
                    $entityReflectionPropertyByName->isReadOnly() && $entityReflectionPropertyByName->isInitialized(
                        $this
                    )
                )
                {
                    continue;
                }

                // Получаем значение свойства DTO
                $value = $this->getPropertyValue($propertyName, $dto);

                if($value !== 'not_initialized')
                {
                    // Присваиваем значение свойству сущности
                    $this->setPropertyValue($propertyName, $value, $this);
                }
            }
        }

        $this->removeEntityManager ? $this->removeEntityManager->flush() : false;

        return $this;
    }


    public function cloneEntity($entity = null)
    {


        if($this instanceof EntityState)
        {
            return $entity ?: $this;
        }

        $clone = clone $this;

        $oReflectionClass = new ReflectionClass($clone);

        if($this->entityManager)
        {
            /** Получаем все свойства с атрибутом ID */
            /** @var ReflectionProperty $property */

            $hash = [];

            foreach($oReflectionClass->getProperties() as $property)
            {
                /** @var ReflectionAttribute $Attr */
                $Attr = $property->getAttributes(ORM\Id::class);

                if($Attr)
                {
                    $keyHashName = $this->getPropertyValue($property->getName(), $this);

                    if($keyHashName !== 'not_initialized')
                    {
                        $hash[$property->getName()] = (string) $keyHashName;
                    }
                }
            }

            if($hash)
            {
                $unitOfWork = $this->entityManager->getUnitOfWork();

                $detach = $unitOfWork->getIdentityMap()[$this::class][implode(' ', $hash)] ?? null;

                if($detach)
                {
                    $this->entityManager->detach($detach);
                }

                if($this instanceof EntityReadonly)
                {
                    $remove = $this->entityManager->getRepository($this::class)->findOneBy($hash);

                    if($remove)
                    {
                        $remove->setEntity($clone);
                        $clone = $remove;
                    }
                }
            }
        }


        foreach($oReflectionClass->getProperties() as $property)
        {
            $propertyName = $property->getName();
            $entityReflectionPropertyByName = new ReflectionProperty($clone, $propertyName);
            $type = null;

            $instanceClassCollection = $property->getType()?->getName();

            // Если свойство является коллекцией
            if(
                interface_exists($instanceClassCollection) && $instanceClassCollection === Collection::class
            )
            {
                $newColl = new ArrayCollection();

                $cloneCollection = $this->getPropertyValue($propertyName, $clone);

                if(is_string($cloneCollection) && $cloneCollection === 'not_initialized')
                {
                    continue;
                }

                foreach($cloneCollection as $coll)
                {
                    //$coll->setRemove($this->remove);
                    $coll->setEntityManager($this->entityManager);
                    $return = $coll->cloneEntity($clone);
                    $newColl->add($return);
                }

                $this->setPropertyValue($propertyName, $newColl, $clone);

                continue;
            }

            // Если свойство O2O (один к одному)

            $reference = $entityReflectionPropertyByName->getAttributes(ORM\OneToMany::class);

            if(!$reference)
            {
                $reference = $entityReflectionPropertyByName->getAttributes(ORM\OneToOne::class);
            }

            if($reference)
            {
                $cloneProperty = $this->getPropertyValue($propertyName, $clone);

                if(!empty($entity) && $cloneProperty instanceof $entity)
                {
                    $this->setPropertyValue($propertyName, $entity, $clone);
                    continue;
                }

                if($cloneProperty === null)
                {
                    continue;
                }

                if(method_exists($cloneProperty, 'cloneEntity'))
                {
                    //$cloneProperty->setRemove($this->remove);
                    $cloneProperty->setEntityManager($this->entityManager);
                    $return = $cloneProperty->cloneEntity($clone);
                    $this->setPropertyValue($propertyName, $return, $clone);
                    continue;
                }
            }

            if(class_exists($property->getType()?->getName()))
            {
                $instanceClass = new ReflectionClass($property->getType()?->getName());
                $typeInstall = $instanceClass->newInstanceWithoutConstructor();

                if(!empty($entity) && $typeInstall instanceof $entity)
                {
                    $this->setPropertyValue($propertyName, $entity, $clone);
                }
            }
        }


        $this->entityManager?->persist($clone);

        return $clone;
    }


    /**
     * Создает новый экземпляр класса без вызова конструктора.
     */

    protected function newClassTypeWithoutConstructor(?string $class)
    {
        // Если свойство класс VO - инстанс без конструктора
        if(class_exists($class))
        {
            $instanceClass = new ReflectionClass($class);
            if($instanceClass->getExtensionName() === false && !$instanceClass->isEnum())
            {
                return $instanceClass->newInstanceWithoutConstructor();
            }
        }

        return false;
    }


    /**
     * Получаем через рефлексию и замыкание значение свойства
     */

    protected function getPropertyValue(string $property, object $object)
    {
        if(!property_exists($object, $property))
        {
            return 'not_initialized';
        }

        $modifiers = new ReflectionProperty($object, $property);

        // Если свойство не инициировано - false
        if(!$modifiers->isInitialized($object))
        {
            return 'not_initialized';
        }

        $getPropertyEntity = Closure::bind(static function($object, $property) {
            return $object->{$property};
        }, null, $object);

        return $getPropertyEntity($object, $property);
    }


    /**
     * Присваиваем через рефлексию замыкание значение свойству
     */

    protected function setPropertyValue(string $property, mixed $value, object $object): bool
    {
        if(!property_exists($object, $property))
        {
            return false;
        }

        $modifiers = new ReflectionProperty($object, $property);

        /* Если свойство не принимает null */
        if($value === null && !$modifiers->getType()?->allowsNull())
        {
            return false;
        }

        /* Если свойство ReadOnly и оно уже инициировано */
        if($modifiers->isReadOnly() && $modifiers->isInitialized($object))
        {
            return false;
        }

        $setPropertyDto = Closure::bind(static function(object $object, string $property, mixed $value) {
            return $object->{$property} = $value;
        }, null, $object);

        $setPropertyDto($object, $property, $value);

        return true;
    }

    public function setEntityManager(?EntityManagerInterface $entityManager): void
    {
        $this->entityManager = $entityManager;
    }


    /** Метод возвращает элемент коллекции Entity, если он был удален из коллекции DTO */
    public function findRemoveElement(object $entityElement, object $dtoCollection, array $properties): bool|object
    {
        // Конкатенируем свойства сущности создавая ключ сравнения
        $entityKey = '';

        foreach($properties as $property)
        {
            $entityKey .= $this->getPropertyValue($property, $entityElement);
        }

        foreach($dtoCollection as $dtoElement)
        {
            // Конкатенируем свойства DTO создавая ключ сравнения
            $dtoKey = '';

            foreach($properties as $property)
            {
                $dtoKey .= $this->getPropertyValue($property, $dtoElement);
            }

            /** Если ключи сравнения равны - в коллекции имеется элемент */
            if($entityKey === $dtoKey)
            {
                return false;
            }

        }

        /** Возвращаем элемент Entity для удаления, если ключи сравнения не найдены */
        return $entityElement;
    }


    /** Метод возвращает элемент коллекции Entity для обновления, либо FALSE для создания */
    public function findUpdateOrCreateElement(
        object $dtoElement,
        object $entityCollection,
        array $properties
    ): bool|object
    {

        // Конкатенируем свойства сущности создавая ключ сравнения
        $dtoKey = '';

        foreach($properties as $property)
        {
            $dtoKey .= $this->getPropertyValue($property, $dtoElement);
        }

        foreach($entityCollection as $entityElement)
        {
            // Конкатенируем свойства DTO создавая ключ сравнения

            $entityKey = '';

            foreach($properties as $property)
            {
                $entityKey .= $this->getPropertyValue($property, $entityElement);
            }

            /** Если ключи сравнения равны - в коллекции имеется элемент, возвращаем для обновления */
            if($dtoKey === $entityKey)
            {
                return $entityElement;
            }

        }

        /** Возвращаем false ля создания нового элемента */
        return false;
    }

}
