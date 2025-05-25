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

namespace BaksDev\Core\Listeners\Entity;


use BaksDev\Users\User\Entity\User;
use BaksDev\Users\User\Repository\UserTokenStorage\UserTokenStorageInterface;
use DateTimeImmutable;
use DateTimeInterface;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Event\PostFlushEventArgs;
use Doctrine\ORM\Events;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\OneToOne;
use Doctrine\ORM\Mapping\Table;
use Doctrine\ORM\PersistentCollection;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Redis;
use ReflectionAttribute;
use ReflectionClass;
use ReflectionProperty;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\SwitchUserToken;

final readonly class EntityKeyValueCache
{
    public function __construct(
        #[Autowire(env: 'REDIS_HOST')] private string $REDIS_HOST,
        #[Autowire(env: 'REDIS_PORT')] private string $REDIS_PORT,
        #[Autowire(env: 'REDIS_PASSWORD')] private string $REDIS_PASSWORD,
        #[Autowire(env: 'REDIS_TABLE')] private string $REDIS_TABLE,
    ) {}

    public function postFlush(PostFlushEventArgs $args): void
    {
        /**
         * Создаем подключение Redis
         */
        $Redis = new Redis();
        $Redis->connect($this->REDIS_HOST, (int) $this->REDIS_PORT);
        $Redis->auth([$this->REDIS_PASSWORD]);
        $Redis->select((int) $this->REDIS_TABLE);


        /**
         * Проходимся по всем измененным объектам
         */

        $UnitOfWork = $args->getObjectManager()->getUnitOfWork();

        foreach($UnitOfWork->getIdentityMap() as $map)
        {
            foreach($map as $key => $entity)
            {
                $ref = new ReflectionClass($entity);

                /** @var ReflectionAttribute $Table */
                $Table = current($ref->getAttributes(Table::class));

                if(false === $Table)
                {
                    continue;
                }

                /** @var ReflectionAttribute $arguments */

                $arguments = $Table->getArguments();
                $tableName = $arguments['name'] ?? false;

                if(true === empty($tableName))
                {
                    continue;
                }

                // создаем ключ индекса
                $cacheHKey = $tableName.':'.str_replace(' ', ':', $key);

                /** @var ReflectionProperty $property */
                foreach($ref->getProperties() as $property)
                {
                    // По умолчанию свойство NULL
                    $cacheValue = null;

                    /**
                     * Пропускаем, если свойство коллекция OneToMany
                     */

                    $OneToMany = $property->getAttributes(OneToMany::class);
                    $OneToMany = current($OneToMany);

                    /** @var ReflectionAttribute $OneToMany */
                    if($OneToMany instanceof ReflectionAttribute && $OneToMany->getName() === OneToMany::class)
                    {
                        continue;
                    }

                    /**
                     * Пропускаем, если свойство OneToOne и оно определено в родительской Entity
                     */

                    $OneToOne = $property->getAttributes(OneToOne::class);
                    $OneToOne = current($OneToOne);


                    /** @var ReflectionAttribute $OneToMany */
                    if(
                        $OneToOne instanceof ReflectionAttribute &&
                        $OneToOne->getName() === OneToOne::class &&
                        array_key_exists('mappedBy', $OneToOne->getArguments())
                    )
                    {
                        continue;
                    }

                    /**
                     * Определяем тип свойства и преобразуем при необходимости в скалярное значение
                     */

                    $entityValue = $property->getValue($entity);

                    $cacheValue = match (true)
                    {
                        /**
                         *  Объект DateTimeImmutable приводим к строке вида Y-m-d\TH:i:sP
                         */
                        $entityValue instanceof DateTimeImmutable => $entityValue->format(DateTimeInterface::ATOM),

                        /**
                         * Скалярные значения присваиваем как есть
                         */
                        is_int($entityValue),
                        is_float($entityValue),
                        is_bool($entityValue),
                        is_null($entityValue),
                        => $entityValue,

                        /**
                         * Массив присваиваем как JSON строку
                         */
                        is_array($entityValue) => json_encode($entityValue, JSON_THROW_ON_ERROR),

                        /**
                         * По умолчанию все приводим к строке
                         */
                        default => (string) $entityValue,
                    };

                    if(false === empty($cacheValue))
                    {
                        $hMset[$property->getName()] = $cacheValue;
                    }
                }

            }

            $Redis->hMset($cacheHKey, $hMset);
            $Redis->expire($cacheHKey, 60);

            unset($hMset);
        }

        /** Сохраняем результат в Redis */
        $Redis->bgSave();
    }
}
