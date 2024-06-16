<?php

namespace BaksDev\Core\Entity\Tests;

use BaksDev\Core\Entity\EntityTestGenerator;
use BaksDev\Products\Product\Entity\Event\ProductEvent;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\DependencyInjection\Attribute\When;

/**
 * @group core
 * @group core-entity-generator
 */
#[When(env: 'test')]
final class EntityTestGeneratorTest extends KernelTestCase
{
    public function testEntityState(): void
    {
        if(class_exists(ProductEvent::class))
        {
            $Entity = EntityTestGenerator::get(ProductEvent::class);
            self::assertInstanceOf(ProductEvent::class, $Entity);
        }
        else
        {
            self::assertTrue(true);
        }

    }
}
