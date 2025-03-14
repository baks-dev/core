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

use BaksDev\Core\Messenger\MessageDispatchInterface;
use BaksDev\Core\Validator\ValidatorCollectionInterface;
use BaksDev\Files\Resources\Upload\File\FileUploadInterface;
use BaksDev\Files\Resources\Upload\Image\ImageUploadInterface;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use DomainException;
use InvalidArgumentException;
use LogicException;

abstract class AbstractHandler
{
    private object|false $command = false;

    /**
     * Объекты событийной модели
     *
     * Для debug в обработчике можно использовать:
     * dump($this->event);
     * dd($this->main);
     */
    protected ?object $main = null;

    protected ?object $event = null;

    private bool $persist = false;



    /**
     * @deprecated свойство entityManager станет приватным, используйте метод абстракции $this->flush()
     * @see self::flush
     */
    protected readonly EntityManagerInterface $entityManager;

    public function __construct(
        EntityManagerInterface $entityManager,
        protected readonly MessageDispatchInterface $messageDispatch,
        protected readonly ValidatorCollectionInterface $validatorCollection,
        protected readonly ImageUploadInterface $imageUpload,
        protected readonly FileUploadInterface $fileUpload,
    )
    {
        $this->entityManager = $entityManager;
    }


    /**
     * Присваивает свойство $command
     */
    public function setCommand(object $command): self
    {
        /** Добавляем к валидации объект DTO */
        $this->validatorCollection->add($command);
        $this->command = $command;
        return $this;
    }

    /**
     * @note Перед вызовом данного метода необходимо передать DTO через вызов метода $this->setCommand($command)
     * @see setCommand
     *
     * Метод определяет по переданным параметрам объект сущности:
     * - если объект сущности не найден - создает новый объект
     * - гидрирует переданные через метод setCommand значения свойств DTO на объект сущности
     * - добавляет объект сущности в коллекцию валидации
     */
    protected function prePersistOrUpdate(string $entity, array $criteria): object
    {
        if($this->command === false)
        {
            throw new InvalidArgumentException('Необходимо передать объект DTO через аргумент метода $this->setCommand($command)');
        }

        $this->entityManager->clear();

        $EntityRepo = $this->entityManager
            ->getRepository($entity)
            ->findOneBy($criteria);

        /** Создаем новый объект сущности если не найдено по переданным параметрам */
        if(false === ($EntityRepo instanceof $entity))
        {
            $EntityRepo = new $entity();
            $this->entityManager->persist($EntityRepo);
        }

        /** В некоторых случаях возможно обновление EntityEvent без создания нового события */
        if(false === ($EntityRepo instanceof EntityState) && false === ($EntityRepo instanceof EntityEvent))
        {
            throw new InvalidArgumentException('Класс сущности не расширяется абстрактным классом EntityState');
        }

        if(false === method_exists($EntityRepo, 'setEntity'))
        {
            throw new InvalidArgumentException(sprintf('Класс сущности %s не реализует метод setEntity($dto)', $EntityRepo::class));
        }

        /** Гидрируем значения одноименных свойств объекта DTO к сущности */
        $EntityRepo->setEntityManager($this->entityManager);
        $EntityRepo->setEntity($this->command);

        /** Добавляем к валидации объект сущности */
        $this->validatorCollection->add($EntityRepo);

        return $EntityRepo;
    }


    /**
     * @note Перед вызовом данного метода необходимо передать DTO через вызов метода $this->setCommand($command)
     * @see setCommand
     *
     * Метод обновляет либо создает объект события:
     * - корневая сущность должна реализовать метод setEvent
     * - событийная сущность должна расширяться от EntityEvent и реализовать метод setMain
     *
     * @note DTO должна реализовать метод getEvent который возвращает идентификатор обновляемого события либо NULL
     * - если getEvent возвращает NULL - создает новый объект события
     * - если getEvent возвращает идентификатор - обновляет событие и присваивает и сохраняет его новую версию
     */
    protected function preEventPersistOrUpdate(string|object $main, string|object|false $event): void
    {
        /**
         * Проверка объекта DTO
         */

        if($this->command === false)
        {
            throw new InvalidArgumentException('Необходимо передать объект DTO через аргумент метода $this->setCommand($command)');
        }

        if(false === $event && false === method_exists($this->command, 'getMain'))
        {
            throw new InvalidArgumentException('Объект DTO не реализует метод getMain()');
        }

        if(false !== $event && false === method_exists($this->command, 'getEvent'))
        {
            throw new InvalidArgumentException('Объект DTO не реализует метод getEvent()');
        }


        /**
         * Проверка структуры корневой сущности
         */

        if(is_string($main) && class_exists($main))
        {
            $main = new $main();
        }

        if(false !== $event && false === method_exists($main, 'setEvent'))
        {
            throw new InvalidArgumentException(sprintf('Корень объекта сущности %s не реализует метод setEvent($event)', $main::class));
        }

        if(false === $event && false === method_exists($main, 'setEntity'))
        {
            throw new InvalidArgumentException(sprintf('Корень объекта сущности %s не реализует метод setEntity($event)', $main::class));
        }


        $this->main = $main;
        $this->validatorCollection->add($this->main);


        if(false !== $event)
        {
            /**
             * Проверка структуры событийной сущности
             */

            if(is_string($event) && class_exists($event))
            {
                $event = new $event();
            }

            if(false === ($event instanceof EntityEvent))
            {
                throw new InvalidArgumentException('Класс сущности не расширяется абстрактным классом EntityEvent');
            }

            if(false === method_exists($event, 'setMain'))
            {
                throw new InvalidArgumentException(sprintf('Событийный объект сущности %s не реализует метод setMain()', $event::class));
            }

            if(false === method_exists($event, 'setEntity'))
            {
                throw new InvalidArgumentException(sprintf('Событийный объект сущности %s не реализует метод setEntity($dto)', $event::class));
            }

            $this->event = $event;

            /**
             * Если getEvent не является идентификатором - создаем новый объект
             */

            if(is_null($this->command->getEvent()) || $this->command->getEvent() === false)
            {
                $this->persistEvent();
            }
            else
            {
                $this->updateEvent();
            }

            /** Добавляем к валидации объект сущности после гидрации */
            $this->validatorCollection->add($this->event);

            return;
        }


        if(is_null($this->command->getMain()) || $this->command->getMain() === false)
        {
            $this->persistMain();
        }
        else
        {
            $this->updateMain();
        }
    }

    /**
     * Метод удаляет корень объекта события и сохраняет событие с новой версией
     */
    protected function preEventRemove(string|object $main, string|object $event): void
    {
        /**
         * Проверка объекта DTO
         */

        if($this->command === false)
        {
            throw new InvalidArgumentException('Необходимо передать объект DTO через аргумент метода $this->setCommand($command)');
        }

        if(false === method_exists($this->command, 'getEvent'))
        {
            throw new InvalidArgumentException('Объект DTO не реализует метод getEvent()');
        }


        /**
         * Проверка структуры корневой сущности
         */

        if(is_string($main) && class_exists($main))
        {
            $main = new $main();
        }

        if(false === method_exists($main, 'setEvent'))
        {
            throw new InvalidArgumentException(sprintf('Корень объекта сущности %s не реализует метод setEvent($event)', $main::class));
        }

        $this->main = $main;
        $this->validatorCollection->add($this->main);

        /**
         * Проверка структуры событийной сущности
         */

        if(is_string($event) && class_exists($event))
        {
            $event = new $event();
        }

        if(false === ($event instanceof EntityEvent))
        {
            throw new InvalidArgumentException('Класс сущности не расширяется абстрактным классом EntityEvent');
        }

        if(false === method_exists($event, 'setMain'))
        {
            throw new InvalidArgumentException(sprintf('Событийный объект сущности %s не реализует метод setMain()', $event::class));
        }

        if(false === method_exists($event, 'setEntity'))
        {
            throw new InvalidArgumentException(sprintf('Событийный объект сущности %s не реализует метод setEntity($dto)', $event::class));
        }

        $this->event = $event;
        $this->validatorCollection->add($this->event);

        $this->updateEvent();

        $this->entityManager->remove($this->main);
    }


    /**
     * Метод создает новый объект события
     */
    private function persistMain(): void
    {
        /** Присваиваем корню идентификатор активного события */
        $this->main->setEntity($this->command);

        /** Добавляем объекты в UOW */
        $this->entityManager->clear();
        $this->entityManager->persist($this->main);

    }

    /**
     * Метод сохраняет объект события с новой версией
     */
    private function updateMain(): void
    {
        /**
         * Получаем корень после clear (для контроля объекта UOW)
         * до сохранения состояния - корневая сущность доступна по идентификатору предыдущего события
         */
        $MainClass = $this->main::class;
        $this->main = $this->entityManager
            ->getRepository($MainClass)
            ->find($this->command->getMain());

        if(
            false === $this->validatorCollection->add($this->main, context: [
                self::class.':'.__LINE__,
                'class' => $MainClass,
                'event' => $this->command->getMain(),
            ])
        )
        {
            throw new DomainException($this->validatorCollection->getErrorUniqid());
        }

        /** Обновляем событие в корне и добавляем Событие в коллекцию валидации  */
        $this->main->setEntity($this->command);
    }


    /**
     * Метод создает новый объект события
     */
    private function persistEvent(): void
    {
        /** Гидрируем значения одноименных свойств объекта DTO к сущности и присваиваем идентификатор корня */
        $this->event->setMain($this->main);
        $this->event->setEntity($this->command);

        /** Присваиваем корню идентификатор активного события */
        $this->main->setEvent($this->event);

        /** Добавляем объекты в UOW */
        $this->entityManager->clear();
        $this->entityManager->persist($this->event);
        $this->entityManager->persist($this->main);
    }

    /**
     * Метод сохраняет объект события с новой версией
     */
    private function updateEvent(): void
    {
        /** Получаем активное событие */
        $EventClass = $this->event::class;
        $EventRepo = $this->entityManager
            ->getRepository($EventClass)
            ->find($this->command->getEvent());

        if(
            !$EventRepo || false === $this->validatorCollection->add($EventRepo, context: [
                self::class.':'.__LINE__,
                'class' => $EventClass,
                'id' => $this->command->getEvent(),
            ])
        )
        {
            throw new DomainException($this->validatorCollection->getErrorUniqid());
        }

        /** Присваиваем одноименные свойства DTO */
        $EventRepo->setEntityManager($this->entityManager);
        $EventRepo->setEntity($this->command);

        /**
         * Через метод клонирования создаем новое событие
         * в методе __clone в событийной сущности при необходимости генерируется новый идентификатор
         */
        $this->entityManager->clear();
        $this->event = $EventRepo->cloneEntity();

        /**
         * Получаем корень после clear (для контроля объекта UOW)
         * до сохранения состояния - корневая сущность доступна по идентификатору предыдущего события
         */
        $MainClass = $this->main::class;
        $this->main = $this->entityManager
            ->getRepository($MainClass)
            ->findOneBy(['event' => $this->command->getEvent()]);

        if(
            false === $this->validatorCollection->add($this->main, context: [
                self::class.':'.__LINE__,
                'class' => $MainClass,
                'event' => $this->command->getEvent(),
            ])
        )
        {
            throw new DomainException($this->validatorCollection->getErrorUniqid());
        }

        /** Обновляем событие в корне и добавляем Событие в коллекцию валидации  */
        $this->main->setEvent($this->event);
    }


    /**
     * @deprecated используйте метод preEventPersistOrUpdate(string|object $main, string|object $event)
     * @see preEventPersistOrUpdate
     */
    protected function preUpdate(object $command, $clone = true): void
    {
        if(!$this->event)
        {
            throw new LogicException(static::class.': Не объявлено свойство event');
        }

        if(!$this->main)
        {
            throw new LogicException(static::class.': Не объявлено свойство main');
        }

        //$this->entityManager->clear();

        /** Получаем активное событие */
        $EventClass = $this->event::class;
        $EventRepo = $this->entityManager
            ->getRepository($EventClass)
            ->find($command->getEvent());

        if(
            !$EventRepo || false === $this->validatorCollection->add($EventRepo, context: [
                self::class.':'.__LINE__,
                'class' => $EventClass,
                'id' => $command->getEvent(),
            ])
        )
        {
            throw new DomainException($this->validatorCollection->getErrorUniqid());
        }

        $EventRepo->setEntityManager($this->entityManager);
        $EventRepo->setEntity($command);

        if($clone)
        {
            $this->entityManager->clear();
            $this->event = $EventRepo->cloneEntity();
        }
        else
        {
            $this->event = $EventRepo;
        }

        /**
         * Получаем корень после clear (для контроля объекта UOW)
         */
        $MainClass = $this->main::class;
        $this->main = $this->entityManager
            ->getRepository($MainClass)
            ->findOneBy(['event' => $command->getEvent()]);

        if(
            false === $this->validatorCollection->add($this->main, context: [
                self::class.':'.__LINE__,
                'class' => $MainClass,
                'event' => $command->getEvent(),
            ])
        )
        {
            throw new DomainException($this->validatorCollection->getErrorUniqid());
        }

        /** Обновляем событие в корне и добавляем Событие в коллекцию валидации  */
        $this->main->setEvent($this->event);

        /** Добавляем валидацию в коллекцию */
        $this->validatorCollection->add($this->event);
        $this->validatorCollection->add($this->main);
    }

    /**
     * @deprecated используйте метод preEventPersistOrUpdate(string|object $main, string|object $event)
     * @see preEventPersistOrUpdate
     */
    protected function prePersist(object $command): void
    {
        if(!$this->event)
        {
            throw new LogicException(static::class.': Не объявлено свойство event');
        }

        if(!$this->main)
        {
            throw new LogicException(static::class.': Не объявлено свойство main');
        }


        $this->entityManager->clear();

        /** Перелинкуем корень и событие */
        $this->event->setMain($this->main);
        $this->event->setEntity($command);

        $this->main->setEvent($this->event);
        $this->entityManager->clear();

        /** Добавляем объекты в UOW */
        $this->entityManager->persist($this->event);
        $this->entityManager->persist($this->main);

        /** Добавляем валидацию в коллекцию */
        $this->validatorCollection->add($this->event);
        $this->validatorCollection->add($this->main);
    }

    /**
     * @deprecated используйте метод preEventRemove(string|object $main, string|object $event)
     * @see preEventRemove
     */
    protected function preRemove(object $command): void
    {

        if(!$this->event)
        {
            throw new LogicException(static::class.': Не объявлено свойство event');
        }

        if(!$this->main)
        {
            throw new LogicException(static::class.': Не объявлено свойство main');
        }

        $this->entityManager->clear();

        /** Получаем активное событие */
        $EventClass = $this->event::class;
        $EventRepo = $this->entityManager
            ->getRepository($EventClass)
            ->find($command->getEvent());

        if(
            !$EventRepo || false === $this->validatorCollection->add($EventRepo, context: [
                self::class.':'.__LINE__,
                'class' => $EventClass,
                'id' => $command->getEvent(),
            ])
        )
        {
            throw new DomainException($this->validatorCollection->getErrorUniqid());
        }

        $EventRepo->setEntityManager($this->entityManager);
        $this->event = $EventRepo->cloneEntity();
        $this->event->setEntity($command);

        /**
         * Получаем корень после clear (для контроля объекта UOW)
         */

        $MainClass = $this->main::class;
        $this->main = $this->entityManager
            ->getRepository($MainClass)
            ->findOneBy(['event' => $command->getEvent()]);

        if(
            false === $this->validatorCollection->add($this->main, context: [
                self::class.':'.__LINE__,
                'class' => $MainClass,
                'event' => $command->getEvent(),
            ])
        )
        {
            throw new DomainException($this->validatorCollection->getErrorUniqid().': '.$command->getEvent());
        }

        $this->entityManager->remove($this->main);

        /** Добавляем валидацию в коллекцию */
        $this->validatorCollection->add($this->event);
        $this->validatorCollection->add($this->main);
    }

    /**
     * Сохраняет все изменения объектов в базу данных, которые находились в UnitOfWork
     * @see UnitOfWork
     */
    public function flush(): void
    {
        $this->entityManager->flush();
    }

    public function clear(): void
    {
        $this->entityManager->clear();
    }

    public function persist(object $object): void
    {
        $this->entityManager->persist($object);
    }

    public function remove(object $object): void
    {
        $this->entityManager->remove($object);
    }


    /**
     * Метод возвращает TRUE в случае, если добавлен новый объект Main
     */
    public function isPersist(): bool
    {
        return $this->persist;
    }

    public function getRepository(string $class): EntityRepository
    {
        if(false === class_exists($class))
        {
            throw new InvalidArgumentException('Invalid Argument Class Entity');
        }

        return $this->entityManager->getRepository($class);
    }
}