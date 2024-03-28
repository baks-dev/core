<?php
/*
 *  Copyright 2023.  Baks.dev <admin@baks.dev>
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

namespace BaksDev\Core\Type\UidType;

use App\Kernel;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Controller\ValueResolverInterface;
use Symfony\Component\HttpKernel\ControllerMetadata\ArgumentMetadata;
use Symfony\Component\Uid\AbstractUid;
use Symfony\Component\Uid\Uuid;

abstract class Uid implements ValueResolverInterface
{
    private Uuid $value;

    public function __construct(AbstractUid|Uid|string|null $value = null)
    {
        /* Применяем фильтр UID */
        if($value !== null && self::isUid($value) === false)
        {
            throw new InvalidArgumentException(sprintf('Invalid Argument Uid: %s', $value));
        }

        if($value === null)
        {
            $this->value = Uuid::v7();

            if(method_exists(Kernel::class, 'isTestEnvironment') && Kernel::isTestEnvironment())
            {
                $this->value = new Uuid(static::TEST);
            }

            return;
        }

        $this->value = new Uuid((string) $value);
    }

    public function __clone(): void
    {
        $this->value = Uuid::v7();
    }

    public function __toString(): string
    {
        return (string) $this->value;
    }

    public function getValue(): Uuid
    {
        return $this->value;
    }

    public function md5(string $md5): self
    {
        $md5 =
            substr($md5, 0, 8).'-'.
            substr($md5, 8, 4).'-'.
            '7'.substr($md5, 12, 3).'-'.
            '9cb9' //substr($md5, 16, 4)
            .'-'.
            substr($md5, 20);

        $this->value = new Uuid($md5);

        return $this;
    }

    public function equals(mixed $value): bool
    {
        if($value === null)
        {
            return false;
        }

        if(is_string($value))
        {
            return (string) $this->value === $value;
        }

        return (string) $this->value === (string) $value->value;
    }

    public static function isUid(mixed $value): bool
    {
        return preg_match('{^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$}Di', $value);
    }


    public function resolve(Request $request, ArgumentMetadata $argument): iterable
    {

        $attr = $argument->getAttributes(ParamConverter::class);
        $ParamConverter = current($attr);

        if(!$ParamConverter)
        {
            return [];
        }

        $Resolver = $ParamConverter->resolver;

        if($Resolver !== $this::class)
        {
            return [];
        }




        $key = $ParamConverter->getKey() ?: 'id';

        $value =
            $request->attributes->get($argument->getName()) ?: // ищем в аргументах по названию переменной
                $request->attributes->get($key) ?: // ищем в аргументах ключ 'id'
                    $request->get($argument->getName()) ?: // ищем в request по названию переменной
                        $request->get($key); // ищем в request ключ 'id'

        if(empty($value))
        {
            return [null];
        }

        return [new $this($value)];
    }
}
