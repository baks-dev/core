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

namespace App\System\Entity;

use App\Module\Menu\Admin\Entity\Section\MenuAdminSection;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\Id as OrmAttributeId;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\OneToOne;
use Doctrine\ORM\PersistentCollection;
use InvalidArgumentException;
use ReflectionClass;
use ReflectionProperty;
use Symfony\Component\String\Inflector\EnglishInflector;

abstract class EntityEvent implements EntityEventInterface
{
	public function setEntity($dto) : mixed
	{
		
		$oReflectionClass = new ReflectionClass($dto);
		
		/* Перебор всех свойств, имеющихся в DTO */
		foreach($oReflectionClass->getProperties() as $property)
		{
			/* Проверяем, имеется ли метод маппинга */
			$propertyName = $property->getName();
			
			
			
			
			/* Пропускаем свойства, которых нет в сущности */
			if(!property_exists($this, $propertyName))
			{
				continue;
			}
			
			
			
			$dtoReflectionPropertyByName = new ReflectionProperty($dto, $propertyName);
			
			/* Если свойство в DTO не инициировано - пропускаем */
			if($dtoReflectionPropertyByName->isInitialized($dto) === false)
			{
				continue;
			}
			
			
		
			
			$entityReflectionPropertyByName = new ReflectionProperty($this, $propertyName);
			
			/* Для обновления свойства сущности из значением из DTO - должен быть объявлен геттер */
			$propertyMethodName = ucfirst($property->getName());
			$getDtoMethod = 'get'.$propertyMethodName;
			
			if(method_exists($dto, $getDtoMethod))
			{
				/* Вызываем геттер, в случае если в геттере что либо вызывается логика */
				$dto->$getDtoMethod();
			}
			
		
			//dump($propertyName);
			//dump($propertyMethodName);
			
			$type = null;
			
			
			/* Если тайпхинт свойства - класс */
			if(class_exists($property->getType()?->getName()))
			{
				$instanceClass = new ReflectionClass($property->getType()?->getName());
				
				/* Если класс Enum */
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
				/* Если в сущности имеется такое одноименнное свойство сущности  */
				if(property_exists($this, $propertyName) && method_exists($dto, $getDtoMethod))
				{
					
					//$entityReflectionPropertyByName = new ReflectionProperty($this, $propertyName);
					$o2m = $entityReflectionPropertyByName->getAttributes(OneToMany::class);
					
					if($o2m)
					{
						$o2oTargetEntity = current($o2m)->getArguments()['targetEntity'];
						
						/* Объявляем новую коллекцию  */
						$this->setPropertyValue($propertyName, new ArrayCollection(), $this);
						$entityCollections = $this->getPropertyValue($propertyName, $this);
						
						/* Получаем коллекцию DTO */
						$collectionDTO = $this->getPropertyValue($propertyName, $dto); // $dto->$getDtoMethod();
						
						foreach($collectionDTO as $value)
						{
							$obj = new $o2oTargetEntity($this);
							//$obj->setClone($this->clone);
							$return = $obj->setEntity($value);
							
							if($return === false)
							{
								$obj = null;
								continue;
							}
							
							/* Добавляем объект в коллецию */
							$entityCollections->add($obj);
							
						}
					}
					
					continue;
					
				}
			}
			
			
			
			
			/*
				Если односторонняя связь на сущность или кастомный тип
				в дто должны объявлены методы get{Property}Class и set{Property}
			*/
			if(class_exists($property->getType()?->getName()) && property_exists($this, $propertyName))
			{
				$o2o = $entityReflectionPropertyByName->getAttributes(OneToOne::class);
				
				if($o2o)
				{
					
					$o2oTargetEntity = current($o2o)->getArguments()['targetEntity'];
					//$getDtoMethod = 'get'.$propertyMethodName;
					
					if(method_exists($dto, $getDtoMethod))
					{
						
						if($dto->$getDtoMethod() !== null)
						{
							
							/* Вызываем геттер, в случае если в геттере что либо вызывается логика */
							$dto->$getDtoMethod();
							
							if($entityReflectionPropertyByName->isInitialized($this) === false)
							{
								$this->setPropertyValue($propertyName, new $o2oTargetEntity($this), $this);
							}
							
							$thisProperty = $this->getPropertyValue($propertyName, $this);
							
							
							if($thisProperty && method_exists($thisProperty, 'setEntity'))
							{
								$return = $thisProperty->setEntity($dto->$getDtoMethod());
								
								if($return === false)
								{
									$this->setPropertyValue($propertyName, null, $this);
								}
							}
						}
					}
					
					continue;
				}
				
			}
			
			
			
			
			/* Если обычное свойство */
			if(property_exists($this, $propertyName) && method_exists($dto, $getDtoMethod))
			{
				
				/* Если свойство сущности ReadOnly и оно уже инициировано - не присваиваем */
				if($entityReflectionPropertyByName->isReadOnly() && $entityReflectionPropertyByName->isInitialized($this))
				{
					continue;
				}
				
				/* Получаем значение свойства DTO */
				$value = $this->getPropertyValue($propertyName, $dto);
				
				if($value !== 'not_initialized')
				{
					/* Присваиваем значение свойству сущности */
					$this->setPropertyValue($propertyName, $value, $this);
				}
				
			}
			
		}
		
		return $this;
	}
	
	public function cloneEntity($entity = null)
	{

		$clone = clone $this;
		$oReflectionClass = new ReflectionClass($clone);
		
		foreach($oReflectionClass->getProperties() as $property)
		{
			
			
			$propertyName = $property->getName();
			$entityReflectionPropertyByName = new ReflectionProperty($clone, $propertyName);
			$type = null;
			
			
			
			$instanceClassCollection = $property->getType()?->getName();
			
			if(
				interface_exists($instanceClassCollection) &&
				$instanceClassCollection === Collection::class
			
			)
			{
				$newColl = new ArrayCollection();
				
				
				
				$cloneCollection = $this->getPropertyValue($propertyName, $clone);
				
				
				foreach($cloneCollection as $coll)
				{
					$return = $coll->cloneEntity($clone);
					$newColl->add($return);
				}
				
				$this->setPropertyValue($propertyName, $newColl, $clone);
				
				continue;
			}
			
			/* Если O2O */
			
			
			$reference = $entityReflectionPropertyByName->getAttributes(OneToMany::class);
			
			if(!$reference)
			{
				$reference = $entityReflectionPropertyByName->getAttributes(OneToOne::class);
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
		
		return $clone;
	}
	
	//	public function isPropertyPrivate(object|string $class, string $property)
	//	{
	//		$modifiers = new ReflectionProperty($class, $property);
	//
	//		return $modifiers->getModifiers() == ReflectionProperty::IS_PRIVATE;
	//	}
	
	/** *************************************************** */
	
	public function getDto($dto) : mixed
	{
		
		
		$dtoReflectionClass = new ReflectionClass($dto);
		$inflector = new EnglishInflector();
		
		foreach($dtoReflectionClass->getProperties() as $property)
		{
			$propertyName = $property->getName();
			$propertyTypeName = $property->getType()?->getName();
			
			$ucSingulars = $inflector->singularize(ucfirst($propertyName));
			$propertyMethodName = end($ucSingulars);
			
			/* Если в сущности нет одноименного свойства - continue */
			if(!property_exists($this, $propertyName))
			{
				continue;
			}
			

			//dump($propertyName);
			//dump($dto->$propertyName);
			//dump($dto->$propertyName->isReadOnly());
			//dump($dto->$propertyName->isInitialized());
			
			/* Инстанс класса без конструктора для получения типа свойства */
			$type = $this->newClassTypeWithoutConstructor($propertyTypeName);
			
			
			
			/** Если тип свойства коллекция */
			if($type instanceof Collection)
			{
				/* Обновляем коллекцию только при наличие метода add  */
				$addDtoMethod = 'add'.$propertyMethodName;
				
				/* Проверяем наличие метода add... в коллекцию  */
				if(method_exists($dto, $addDtoMethod))
				{
					$collectionClass = current($dtoReflectionClass->getMethod($addDtoMethod)->getParameters())
						->getType()?->getName()
					;
					
					/* Получаем значение свойств сущности */
					/** @var PersistentCollection $getEntityProperty */
					$getEntityProperty = $this->getPropertyValue($propertyName, $this);
		
					/* Проходимся по всей коллекции сущности и заполняем DTO */
					foreach($getEntityProperty as $entityCollection)
					{
						
						$collectionInstance = new $collectionClass;
						
						/* Заполняем DTO из коллекции значениями из сущности */
						//$mapperCollectionDto = new self();
						//$dataCollectionDto = $mapperCollectionDto->map($entityCollection, $collectionInstance);
						
						if(method_exists($dto, $addDtoMethod))
						{
							/* Заполняем DTO из коллекции значениями из сущности  добавляем в коллекцию */
							$dataCollectionDto = $entityCollection->getDto($collectionInstance);
							$dto->$addDtoMethod($dataCollectionDto);
						}
					}
					
					
					
				}
				
				continue;
			}

			
			/* Если тип свойства - класс */
			if($type !== false)
			{
				/** если имеется константа TYPE - класс ValueObject */
				if(defined($propertyTypeName.'::TYPE'))
				{
					$getEntityProperty = $this->getPropertyValue($propertyName, $this);
					
					if($getEntityProperty !== 'not_initialized')
					{
						$valueObject = new $propertyTypeName($getEntityProperty);
						$this->setPropertyValue($propertyName, $valueObject, $dto);
					}
					
					continue;
				}
				
				
				
				/* Если связь OneToOne */
				$modifiers = new ReflectionProperty($this, $propertyName);
				$attr = $modifiers->getAttributes();
				
				foreach($attr as $item)
				{
					if($item->newInstance() instanceof \Doctrine\ORM\Mapping\OneToOne)
					{
						/** Инстанс класса односторонней связи */
						$oneToOne = new $propertyTypeName;
						
						if($oneToOne)
						{
							$getEntityProperty = $this->getPropertyValue($propertyName, $this);
							
							if($getEntityProperty && $getEntityProperty != 'not_initialized')
							{
								$dataOneToOneDto = $getEntityProperty->getDto($oneToOne);
								$this->setPropertyValue($propertyName, $dataOneToOneDto, $dto);
							}
							
							continue 2;
						}
					}
				}
			}
			

			
			/** Если свойство скалярное или ManyToOne */
			$getEntityProperty = $this->getPropertyValue($propertyName, $this);
			if($getEntityProperty !== 'not_initialized')
			{
				$this->setPropertyValue($propertyName, $getEntityProperty, $dto);
			}
			
			
		}
		
		
		
		
		
		return $dto;
	}
	
	
	/** Получаем через рефлексию значение свойства */
	private function getPropertyValue(string $property, object $object)
	{
		$modifiers = new ReflectionProperty($object, $property);
		
		/* Если свойство не инициировано - false*/
		if(!$modifiers->isInitialized($object))
		{
			return 'not_initialized';
		}
		
		$getPropertyEntity = \Closure::bind(function($object, $property){
			
			return $object->{$property};
			
		}, null, $object);
		
		return $getPropertyEntity($object, $property);
	}
	
	/** Присваиваем через рефлексию значение свойству */
	private function setPropertyValue(string $property, mixed $value, object $object) : void
	{
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
		
		$setPropertyDto = \Closure::bind(function(object $object, string $property, mixed $value){
			return $object->{$property} = $value;
		}, null, $object);
		
		$setPropertyDto($object, $property, $value);
		
	}
	
	
	private function newClassTypeWithoutConstructor(?string $class)
	{
		/* Если свойство класс VO - инстанс без конструктора */
		if(class_exists($class))
		{
			$instanceClass = new ReflectionClass($class);
			
			if($instanceClass->getExtensionName() === false)
			{
				return $instanceClass->newInstanceWithoutConstructor();
			}
		}
		
		return false;
	}
	
	
}