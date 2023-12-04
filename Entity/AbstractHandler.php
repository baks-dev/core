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

use BaksDev\Core\Messenger\MessageDispatchInterface;
use BaksDev\Core\Validator\ValidatorCollectionInterface;
use BaksDev\Files\Resources\Upload\File\FileUploadInterface;
use BaksDev\Files\Resources\Upload\Image\ImageUploadInterface;
use Doctrine\ORM\EntityManagerInterface;
use DomainException;
use LogicException;

abstract class AbstractHandler
{

    protected ?object $event = null;

    protected ?object $main = null;

    protected EntityManagerInterface $entityManager;

    protected MessageDispatchInterface $messageDispatch;

    protected ValidatorCollectionInterface $validatorCollection;

    protected ImageUploadInterface $imageUpload;

    protected FileUploadInterface $fileUpload;

    public function __construct(
        EntityManagerInterface $entityManager,
        MessageDispatchInterface $messageDispatch,
        ValidatorCollectionInterface $validatorCollection,
        ImageUploadInterface $imageUpload,
        FileUploadInterface $fileUpload,
    )
    {
        $this->entityManager = $entityManager;
        $this->messageDispatch = $messageDispatch;
        $this->validatorCollection = $validatorCollection;
        $this->imageUpload = $imageUpload;
        $this->fileUpload = $fileUpload;
    }


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
        $EventRepo = $this->entityManager
            ->getRepository($this->event::class)
            ->find($command->getEvent());

        if(false === $this->validatorCollection->add($EventRepo, context: [__FILE__.':'.__LINE__]))
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
        $this->main = $this->entityManager
            ->getRepository($this->main::class)
            ->findOneBy(['event' => $command->getEvent()]);

        if(false === $this->validatorCollection->add($this->main, context: [__FILE__.':'.__LINE__]))
        {
            throw new DomainException($this->validatorCollection->getErrorUniqid());
        }

        /** Обновляем событие в корне и добавляем Событие в коллекцию валидации  */
        $this->main->setEvent($this->event);

        /** Добавляем валидацию в коллекцию */
        $this->validatorCollection->add($this->event);
        $this->validatorCollection->add($this->main);
    }

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
        $EventRepo = $this->entityManager
            ->getRepository($this->event::class)
            ->find($command->getEvent());

        if(false === $this->validatorCollection->add($EventRepo, context: [__FILE__.':'.__LINE__]))
        {
            throw new DomainException($this->validatorCollection->getErrorUniqid());
        }

        $EventRepo->setEntityManager($this->entityManager);
        $this->event = $EventRepo->cloneEntity();
        $this->event->setEntity($command);

        /**
         * Получаем корень после clear (для контроля объекта UOW)
         */
        $this->main = $this->entityManager
            ->getRepository($this->main::class)
            ->findOneBy(['event' => $command->getEvent()]);

        if(false === $this->validatorCollection->add($this->main, context: [__FILE__.':'.__LINE__]))
        {
            throw new DomainException($this->validatorCollection->getErrorUniqid());
        }

        $this->entityManager->remove($this->main);

        /** Добавляем валидацию в коллекцию */
        $this->validatorCollection->add($this->event);
        $this->validatorCollection->add($this->main);
    }

}