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

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping\Id as OrmAttributeId;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\OneToOne;
use InvalidArgumentException;
use ReflectionClass;
use ReflectionProperty;
use Symfony\Component\String\Inflector\EnglishInflector;

abstract class EntityState implements EntityEventInterface
{
	private ?ArrayCollection $remove = null;
	
	public function setRemove(?ArrayCollection $remove) : void
	{
		$this->remove = $remove;
	}
	
	
	public function setEntity($dto) : mixed
	{
		
		$dtoReflectionClass = new ReflectionClass($dto);
		
		/* Перебор всех свойств, имеющихся в DTO */
		foreach($dtoReflectionClass->getProperties() as $property)
		{
			
			/* Проверяем, имеется ли метод маппинга */
			$propertyName = $property->getName();
			
			/* Пропускаем свойства, которых нет одноименных в сущности */
			if(!property_exists($this, $propertyName))
			{
				continue;
			}
			
			/* Для обновления свойства сущности из значением из DTO - должен быть объявлен геттер */
			$propertyMethodName = ucfirst($property->getName());
			$getDtoMethod = 'get'.$propertyMethodName;
			
			if(method_exists($dto, $getDtoMethod) && $property->isInitialized($dto))
			{
				/* Вызываем геттер, в случае если в геттере что либо вызывается логика */
				$dto->$getDtoMethod();
			}
			
			$entityReflectionPropertyByName = new ReflectionProperty($this, $propertyName);
			
			/* Делаем проверку всех идентификаторов */
			$isOrmAttributeId = (bool) $entityReflectionPropertyByName->getAttributes(OrmAttributeId::class);
			
			if($isOrmAttributeId === true && $entityReflectionPropertyByName->isReadOnly() === false)
			{
				throw new InvalidArgumentException(
					sprintf('Свойство %s  класса %s должно быть readonly', $propertyName, $this::class)
				);
			}
			
			//dump($propertyName);
			//dump($propertyMethodName);
			
			$type = null;
			
			/* Если тайпхинт свойства не являющийся классом, интерфейсом или трейтом */
			//if(class_exists($property->getType()?->getName()))
			if(!$property->getType()?->isBuiltin())
			{
				$instanceClass = new ReflectionClass($property->getType()?->getName());
				$type = $instanceClass->newInstanceWithoutConstructor();
			}
			
			
			if($type instanceof Collection)
			{
				/* Для обновления свойства сущности из значением из DTO - должен быть объявлен геттер */
				$getDtoMethod = 'get'.$propertyMethodName;
				if(method_exists($dto, $getDtoMethod))
				{
					$o2m = $entityReflectionPropertyByName->getAttributes(OneToMany::class);
					
					if($o2m)
					{
						$o2mTargetEntity = current($o2m)->getArguments()['targetEntity'];
						
						if($this->remove === null)
						{
							$this->remove = new ArrayCollection();
						}
						
						/* Получаем всю коллекцию из DTO  */
						//$collectionDTO = $dto->$getDtoMethod();
						$collectionDTO = $this->getPropertyValue($propertyName, $dto);
						
						/* Если в сущности не инициировано свойство коллекции - инициируем ArrayCollection */
						if((new ReflectionProperty($this, $propertyName))->isInitialized($this) === false)
						{
							$this->setPropertyValue($propertyName, new ArrayCollection(), $this);
						}
						
						$entityCollections = $this->getPropertyValue($propertyName, $this);
						
						//dd($entityCollections);
						
						/* Перебираем имеющуюся коллекцию сущности для удаление или добавления новой коллекции */
						foreach($entityCollections as $entityCollection)
						{
							/* Передаем коллецию объектов для удаления  */
							$entityCollection->setRemove($this->remove);
							
							/* Поиск всех атрибутов ID */
							$reflectionEntityCollection = new ReflectionClass($entityCollection);
							
							/* Получаем все ствойства, имеющие атрибут ORM\Id() для сверки */
							$arrEntityId = array_filter(
								$reflectionEntityCollection->getProperties(),
								static function($collProps){
									return (bool) $collProps->getAttributes(OrmAttributeId::class);
								}
							);
							
							/* создаем STD для проверки удаленной коллекции */
							$stdEntity = new \stdClass();
							
							/* Присваиваем свойства и их значения, имеющие атрибут ORM\Id() */
							array_map(
								function(ReflectionProperty $collPropsEntity) use (
									$stdEntity,
									$entityCollection
								) : void{
									
									$stdEntity->{$collPropsEntity->name} = (string) $this->getPropertyValue(
										$collPropsEntity->name,
										$entityCollection
									);
								},
								$arrEntityId
							);
							
							
							/* Флаг, имеется ли коллекия в DTO */
							$isset = false;
							
							
							/* Смотрим, имеются ли указанные идентификаторы в DTO */
							foreach($collectionDTO as $itemColl)
							{
								$stdDTO = new \stdClass();
								
								/* Присваиваем свойства имеющие атрибут ORM\Id() в сущности значениями из DTO */
								array_map(
									function(ReflectionProperty $collPropsDto) use ($stdDTO, $itemColl) : void{
										
										$stdDTO->{$collPropsDto->name} = (string) $this->getPropertyValue(
											$collPropsDto->name,
											$itemColl
										);
									},
									$arrEntityId
								);
								
								if($stdDTO == $stdEntity)
								{
									/* Обновляем сущность найденной коллекцией DTO */
									$return = $entityCollection->setEntity($itemColl);
									
									$collectionDTO->removeElement($itemColl);
									
									$isset = true;
									break;
								}
							}
							
							/* Если в переданной колекции DTO отстуствует сущность - удаляем сущность */
							if($isset === false)
							{
								//dump($entityCollection);
								
								$entityCollections->removeElement($entityCollection);
								$this->remove->add($entityCollection);
							}
							
							
						}
						
						
						// Если добавлен новый элемент колелкции
						if
						(
							(is_array($collectionDTO) && !empty($collectionDTO)) ||
							($collectionDTO instanceof ArrayCollection && !$collectionDTO->isEmpty())
						)
						{
							foreach($collectionDTO as $value)
							{
								$obj = new $o2mTargetEntity($this);
								$return = $obj->setEntity($value);
								
								if($return === false)
								{
									$obj = null;
									continue;
								}
								
								$entityCollections->add($obj);
							}
						}
						
					}
					
					continue;
				}
				
			}
			
			
			/*
				Если односторонняя связь на сущность или кастомный тип
			*/
			//if(class_exists($property->getType()?->getName()))
			if(!$property->getType()?->isBuiltin())
			{
				$o2o = $entityReflectionPropertyByName->getAttributes(OneToOne::class);
				
				if($o2o)
				{
					$o2oTargetEntity = current($o2o)->getArguments()['targetEntity'];
					
					/* в DTO должен быть объявлен метод геттер  */
					$getDtoMethod = 'get'.$propertyMethodName;
					if(method_exists($dto, $getDtoMethod))
					{
						/* Инициируем новую сущность, если она не инициирована */
						if($entityReflectionPropertyByName->isInitialized($this) === false)
						{
							$this->setPropertyValue($propertyName, new $o2oTargetEntity($this), $this);
						}
						
						$thisProperty = $this->getPropertyValue($propertyName, $this);
						
						if(method_exists($thisProperty, 'setEntity'))
						{
							$return = $thisProperty->setEntity($dto->$getDtoMethod());
							
							if($return === false)
							{
								$this->setPropertyValue($propertyName, null, $this);
							}
						}
						
						unset($thisProperty);
						
					}
					
					continue;
				}
			}
			
			
			/* Если обычное свойство, и в сущности имеется одноименное свойство */
			if(property_exists($this, $propertyName))
			{
				/* Если свойство сущности ReadOnly и оно уже инициировано - не присваиваем */
				if($entityReflectionPropertyByName->isReadOnly() && $entityReflectionPropertyByName->isInitialized($this))
				{
					continue;
				}
				
				/* Получаем значение свойства DTO */
				$dtoPropertyValue = $this->getPropertyValue($propertyName, $dto);
				
				if($dtoPropertyValue !== 'not_initialized')
				{
					/* Присваиваем значение свойству сущности */
					$this->setPropertyValue($propertyName, $dtoPropertyValue, $this);
				}
				
				unset($dtoPropertyValue);
			}
			
		}
		
		return $this;
	}
	
	
	/** *************************************************** */
	
	public function getDto($dto) : mixed
	{
		$dtoReflectionClass = new ReflectionClass($dto);
		$inflector = new EnglishInflector();
		
		foreach($dtoReflectionClass->getProperties() as $property)
		{
			$propertyName = $property->getName();
			$propertyTypeName = $property->getType()?->getName();
			
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
				$ucSingulars = $inflector->singularize(ucfirst($property->getName()));
				$propertyMethodName = end($ucSingulars);
				
				$addDtoMethod = 'add'.$propertyMethodName;
				
				/* Проверяем наличие метода add... в коллекцию  */
				if(method_exists($dto, $addDtoMethod))
				{
					$collectionClass = current($dtoReflectionClass->getMethod($addDtoMethod)->getParameters())
						->getType()?->getName()
					;
					
					/* Получаем значение свойств сущности */
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
			//if($type !== false)
			if(!$property->getType()?->isBuiltin())
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
				
				
				$entityReflectionPropertyByName = new ReflectionProperty($this, $propertyName);
				$o2o = $entityReflectionPropertyByName->getAttributes(OneToOne::class);
				
				
				/* Если связь OneToOne */
				if($o2o)
				{
					/** Инстанс класса односторонней связи */
					$oneToOne = new $propertyTypeName;
					
					if($oneToOne)
					{
						/* Получаем значение свойства сущности */
						$getEntityProperty = $this->getPropertyValue($propertyName, $this);
						
						
						//dump($this::class);
						//dump($propertyTypeName);
						
						
						/* Присваиваем значение свойству сущности */
						$dataOneToOneDto = $getEntityProperty->getDto($oneToOne);
						$this->setPropertyValue($propertyName, $dataOneToOneDto, $dto);
						
						continue;
					}
				}
			}
			
			/** Если свойство скалярное или ManyToOne */
			$getEntityProperty = $this->getPropertyValue($propertyName, $this);
			$this->setPropertyValue($propertyName, $getEntityProperty, $dto);
			
		}
		
		return $dto;
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
	
	
	/**
	 * @return ArrayCollection
	 */
	public function getRemoveEntity() : ?ArrayCollection
	{
		return $this->remove;
	}
}