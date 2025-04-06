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

    public function md5(string $string): self
    {
        $md5 = md5($string);

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
