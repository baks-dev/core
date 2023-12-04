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

use InvalidArgumentException;
use ReflectionClass;
use ReflectionProperty;
use Symfony\Component\String\Inflector\EnglishInflector;

final class DtoReflection
{
    private object $dto;

    private EnglishInflector $inflector;

    private ReflectionClass $dtoReflectionClass;

    private ReflectionProperty $dtoReflectionProperty;

    public function __construct(object|string $dto)
    {
        if(is_string($dto))
        {
            if(!class_exists($dto))
            {
                throw new InvalidArgumentException('Not found class %s');
            }

            $dto = new $dto();
        }

        $this->dto = $dto;

        $this->inflector = new EnglishInflector();

        $this->dtoReflectionClass = new ReflectionClass($dto);
    }

    /**
     * Dto
     */
    public function getDto(): object
    {
        return $this->dto;
    }


    /**
     * Возвращает все свойства класса
     * @return ReflectionProperty[]
     */
    public function getProperties(): array
    {
        return $this->dtoReflectionClass->getProperties();
    }

    /** Присваивает свойство ReflectionProperty  */
    public function setReflectionProperty(ReflectionProperty $property)
    {
        $this->dtoReflectionProperty = $property;
    }


    /**
     * Получает имя свойства
     */
    public function getPropertyName(): string
    {
        return $this->dtoReflectionProperty->getName();
    }

    public function hasConstant(string $name): bool
    {
        return $this->dtoReflectionClass->hasConstant($name);
    }

    /**
     * Получите текстовое значение типа (string)
     */
    public function getPropertyTypeName(): string
    {
        return $this->dtoReflectionProperty->getType()?->getName();
    }

    public function getPropertyMethodName()
    {
        $propertyName = $this->getPropertyName();
        $ucSingulars = $this->inflector->singularize(ucfirst($propertyName));
        return end($ucSingulars);
    }

    /**
     * Получить instance класса без конструктора для определения типа
     */
    public function getPropertyInstanceType(): object|string|bool
    {
        $class = $this->getPropertyTypeName();

        if(!$class || !class_exists($class))
        {
            return false;
        }

        // Если свойство класс VO - инстанс без конструктора
        $instanceClass = new ReflectionClass($class);

        if($instanceClass->getExtensionName() === false && !$instanceClass->isEnum())
        {
            return $instanceClass->newInstanceWithoutConstructor();
        }

        return new $class();
    }


    public function getMethodAdder(): bool|string
    {
        $propertyName = $this->getPropertyMethodName();

        $addDtoMethod = 'add'.$propertyName;

        if(!method_exists($this->dto, $addDtoMethod))
        {
            $addDtoMethod = 'add'.ucfirst($propertyName);

            if(!method_exists($this->dto, $addDtoMethod))
            {
                return false;
            }

        }

        return $addDtoMethod;
    }

    public function getMethodSetter(): bool|string
    {
        $propertyName = $this->getPropertyMethodName();

        $setDtoMethod = 'set'.$propertyName;

        if(!method_exists($this->dto, $setDtoMethod))
        {
            return false;
        }

        return $setDtoMethod;
    }

    public function getMethodGetter(): bool|string
    {
        $propertyName = $this->getPropertyMethodName();

        $getDtoMethod = 'get'.$propertyName;

        if(!method_exists($this->dto, $getDtoMethod))
        {
            return false;
        }

        return $getDtoMethod;
    }


    /** Возвращает  */
    public function getTypeParameterMethod(string $method): string
    {
        $parameters = $this->dtoReflectionClass->getMethod($method)->getParameters();

        return current($parameters)->getType()?->getName();
    }

}