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

namespace BaksDev\Core\Validator\Tests;

use ArrayObject;
use BaksDev\Core\Doctrine\ORMQueryBuilder;
use BaksDev\Core\Validator\ValidatorCollectionInterface;
use BaksDev\Products\Category\Type\Id\CategoryProductUid;
use BaksDev\Products\Category\Type\Section\Field\Id\CategoryProductSectionFieldUid;
use BaksDev\Users\Profile\UserProfile\Type\Id\UserProfileUid;
use BaksDev\Wildberries\Products\Entity\Barcode\Event\WbBarcodeEvent;
use BaksDev\Wildberries\Products\Entity\Barcode\WbBarcode;
use BaksDev\Wildberries\Products\UseCase\Barcode\Delete\WbBarcodeDeleteDTO;
use BaksDev\Wildberries\Products\UseCase\Barcode\Delete\WbBarcodeDeleteHandler;
use BaksDev\Wildberries\Products\UseCase\Barcode\NewEdit\Custom\WbBarcodeCustomDTO;
use BaksDev\Wildberries\Products\UseCase\Barcode\NewEdit\Property\WbBarcodePropertyDTO;
use BaksDev\Wildberries\Products\UseCase\Barcode\NewEdit\Tests\EditHandleTest;
use BaksDev\Wildberries\Products\UseCase\Barcode\NewEdit\WbBarcodeDTO;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\DependencyInjection\Attribute\When;
use Symfony\Component\Uid\Uuid;

/**
 * @group core
 * @group core-validator
 */
#[When(env: 'test')]
final class ValidatorCollectionTest extends KernelTestCase
{

    public function testValidatorCollectionNotNull(): void
    {
        $container = self::getContainer();

        /** @var ArrayObject $ValidatorCollection */
        $ValidatorCollection = $container->get(ValidatorCollectionInterface::class);

        $ValidatorCollection->add(new ValidatorCollectionDTO());
        $validate = $ValidatorCollection->isInvalid();

        self::assertNotNull($validate);

    }

    public function testValidatorCollectionNull(): void
    {
        $container = self::getContainer();

        /** @var ArrayObject $ValidatorCollection */
        $ValidatorCollection = $container->get(ValidatorCollectionInterface::class);


        $ValidatorCollection->add(null);
        $validate = $ValidatorCollection->isInvalid();

        self::assertNotNull($validate);


        $ValidatorCollectionDTO = new ValidatorCollectionDTO(Uuid::v7());
        $ValidatorCollectionDTO->setEvent(Uuid::v7());
        $ValidatorCollection->add($ValidatorCollectionDTO);
        $validate = $ValidatorCollection->isInvalid();

        self::assertFalse($validate);






    }

}
