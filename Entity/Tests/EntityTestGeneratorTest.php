<?php

namespace BaksDev\Core\Entity\Tests;

use BaksDev\Core\Entity\EntityTestGenerator;
use BaksDev\Products\Product\Entity\Event\ProductEvent;
use BaksDev\Users\User\Type\Id\UserUid;
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
        $Entity = EntityTestGenerator::get(ProductEvent::class);
        self::assertInstanceOf(ProductEvent::class, $Entity);
    }
}
