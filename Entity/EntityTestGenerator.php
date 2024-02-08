<?php
/*
 *  Copyright 2023.  Baks.dev <admin@baks.dev>
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

use BaksDev\Core\Type\UidType\Uid;
use Closure;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\OneToOne;
use Exception;
use ReflectionAttribute;
use ReflectionClass;
use ReflectionNamedType;
use ReflectionProperty;
use ReflectionUnionType;

final class EntityTestGenerator
{

    public static function get(string|object $entity): object
    {

        if(is_string($entity))
        {
            if(!class_exists($entity))
            {
                throw new Exception('Entity not found');
            }

            $entity = new $entity();
        }


        $oReflectionClass = new ReflectionClass($entity);

        foreach($oReflectionClass->getProperties() as $property)
        {
            $propertyName = $property->getName();
            $entityReflectionPropertyByName = new ReflectionProperty($entity, $propertyName);
            $type = null;


            //dump($propertyName.' = '.$property->getType()?->getName());

            // Если свойство OneToMany (один к многим)
            if($reference = $entityReflectionPropertyByName->getAttributes(OneToMany::class))
            {
                /** @var ReflectionAttribute $Attribute */
                $Attribute = current($reference);

                if(!isset($Attribute->getArguments()['targetEntity']))
                {
                    continue;
                }

                $class = $Attribute->getArguments()['targetEntity'];

                if(class_exists($class))
                {
                    $entityCollections = new ArrayCollection();
                    self::setPropertyValue($propertyName, $entityCollections, $entity);

                    $instance = new $class($entity);
                    self::get($instance);

                    $entityCollections->add($instance);
                }


                continue;
            }


            // Если свойство ManyToOne (многие к одному)
            if($entityReflectionPropertyByName->getAttributes(ManyToOne::class))
            {
                continue;
            }

            // Если свойство O2O (один к одному)
            if($reference = $entityReflectionPropertyByName->getAttributes(OneToOne::class))
            {

                /** @var ReflectionAttribute $Attribute */
                $Attribute = current($reference);

                if(isset($Attribute->getArguments()['inversedBy']))
                {
                    continue;
                }

                $class = $property->getType()?->getName();

                if(class_exists($class))
                {
                    $instance = new $class($entity);
                    self::get($instance);

                    self::setPropertyValue($propertyName, $instance, $entity);

                }

                continue;

                //                $cloneProperty = $this->getPropertyValue($propertyName, $clone);
                //
                //                if(!empty($entity) && $cloneProperty instanceof $entity)
                //                {
                //                    $this->setPropertyValue($propertyName, $entity, $clone);
                //                    continue;
                //                }
                //
                //                if($cloneProperty === null)
                //                {
                //                    continue;
                //                }
                //
                //                if(method_exists($cloneProperty, 'cloneEntity'))
                //                {
                //                    //$cloneProperty->setRemove($this->remove);
                //                    $cloneProperty->setEntityManager($this->entityManager);
                //                    $return = $cloneProperty->cloneEntity($clone);
                //                    $this->setPropertyValue($propertyName, $return, $clone);
                //                    continue;
                //                }
            }




            if(class_exists($property->getType()?->getName()))
            {
                $instanceClass = new ReflectionClass($property->getType()?->getName());
                $typeInstall = $instanceClass->newInstanceWithoutConstructor();

                if($typeInstall instanceof DateTimeImmutable)
                {
                    $class = new DateTimeImmutable();
                    self::setPropertyValue($propertyName, $class, $entity);
                    continue;
                }

                $paramConstructor = $instanceClass->getConstructor()?->getParameters();

                $parameners = [];

                if($paramConstructor)
                {
                    foreach($paramConstructor as $param)
                    {
                        $paramName = $param->getName();

                        /** @var ReflectionUnionType $paramType */
                        $paramType = $param->getType();

                        /* если параметр мултитайп  */
                        if($paramType instanceof ReflectionUnionType)
                        {
                            /** @var ReflectionNamedType $type */
                            foreach($paramType->getTypes() as $type)
                            {

                                if($type->getName() === 'Symfony\Component\Uid\AbstractUid' || $type->getName() === 'Symfony\Component\Uid\Uuid')
                                {
                                    $parameners[$paramName] = $instanceClass->getName()::TEST;
                                    break;
                                }

                                if($type->getName() === 'self')
                                {
                                    $parameners[$paramName] = $instanceClass->hasConstant('TEST') ? $instanceClass->getName()::TEST : $paramName;
                                    break;
                                }

                                if($type->getName() === 'string')
                                {
                                    $parameners[$paramName] = $type->getName();
                                    break;
                                }

                                if(interface_exists($type->getName()))
                                {
                                    $parameners[$paramName] = $instanceClass->hasConstant('TEST') ? $instanceClass->getName()::TEST : $paramName;
                                    break;
                                }

                                if(class_exists($type->getName()))
                                {
                                    $new = $type->getName();
                                    $parameners[$paramName] = new $new($new::TEST);
                                    break;
                                }

                                $parameners[$paramName] = $instanceClass->getName()::TEST;
                            }
                        }

                        /* если параметр с одиночный */
                        else
                        {



                            /** @var ReflectionNamedType $paramType */
                            $paramTypeName = $paramType->getName();



                            if($paramTypeName === 'mixed')
                            {
                                $parameners[$paramName] = $paramName;
                                continue;
                            }

                            if($paramTypeName === 'bool')
                            {
                                $parameners[$paramName] = true;
                                continue;
                            }

                            if($paramTypeName === 'Symfony\Component\Uid\AbstractUid' || $paramTypeName === 'Symfony\Component\Uid\Uuid')
                            {
                                $parameners[$paramName] = $instanceClass->getName()::TEST;
                                continue;
                            }



                            if(interface_exists($paramTypeName))
                            {
                                $parameners[$paramName] = $instanceClass->hasConstant('TEST') ? $instanceClass->getName()::TEST : $paramName;
                                continue;
                            }


                            if(class_exists($paramTypeName))
                            {
                                $parameners[$paramName] = new $paramTypeName($paramTypeName::TEST);
                                continue;
                            }

                            if($paramTypeName === 'string')
                            {
                                $parameners[$paramName] = $paramName;
                                continue;
                            }
                        }
                    }

                    //dd($parameners);
                }

                //                if($typeInstall instanceof \BaksDev\Reference\Money\Type\Money)
                //                {
                //                    dd($parameners);
                //                }


//                dump($typeInstall::class);
//                dump($parameners);

                $class = new $typeInstall(...$parameners);
                self::setPropertyValue($propertyName, $class, $entity);
                unset($parameners);
                continue;
            }

            if($property->getType()?->getName() === 'string')
            {
                self::setPropertyValue($propertyName, $propertyName, $entity);
                continue;
            }

            if($property->getType()?->getName() === 'int')
            {
                self::setPropertyValue($propertyName, 1, $entity);
                continue;
            }

            if($property->getType()?->getName() === 'bool')
            {
                self::setPropertyValue($propertyName, true, $entity);
                continue;
            }

            //dump('$property->getType()');
            //dd($property->getType());

        }

        return $entity;
    }


    protected static function setPropertyValue(string $property, mixed $value, object $object): void
    {
        if(!property_exists($object, $property))
        {
            return;
        }

        $modifiers = new ReflectionProperty($object, $property);

        /* Если свойство не принимает null */
        if($value === null && !$modifiers->getType()?->allowsNull())
        {
            return;
        }

        /* Если свойство ReadOnly и оно уже инициировано */
        if($modifiers->isReadOnly() && $modifiers->isInitialized($object))
        {
            return;
        }

        $setPropertyDto = Closure::bind(static function(object $object, string $property, mixed $value) {
            return $object->{$property} = $value;
        }, null, $object);

        $setPropertyDto($object, $property, $value);

    }
}