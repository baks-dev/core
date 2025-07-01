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

namespace BaksDev\Core\Doctrine\Tests;

use BaksDev\Core\Cache\AppCacheInterface;
use BaksDev\Core\Deduplicator\DeduplicatorInterface;
use BaksDev\Core\Doctrine\DBALQueryBuilder;
use BaksDev\Core\Messenger\MessageDispatchInterface;
use BaksDev\Core\Services\Switcher\SwitcherInterface;
use BaksDev\Users\Profile\UserProfile\Repository\UserProfileTokenStorage\UserProfileTokenStorageInterface;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Query\QueryBuilder;
use PHPUnit\Framework\Attributes\Group;
use PHPUnit\Framework\TestCase;
use Psr\Cache\CacheItemPoolInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\DependencyInjection\Attribute\When;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

#[Group('core')]
#[When(env: 'test')]
final class DBALQueryBuilderTest extends TestCase
{
    private Connection $connection;
    private TranslatorInterface $translator;
    private SwitcherInterface $switcher;
    private AppCacheInterface $cache;
    private DeduplicatorInterface $deduplicator;
    private MessageDispatchInterface $dispatch;
    private UserProfileTokenStorageInterface $storage;

    protected function setUp(): void
    {
        $this->connection = $this->createMock(Connection::class);
        $this->translator = $this->createMock(TranslatorInterface::class);
        $this->switcher = $this->createMock(SwitcherInterface::class);
        $this->cache = $this->createMock(AppCacheInterface::class);
        $this->deduplicator = $this->createMock(DeduplicatorInterface::class);
        $this->dispatch = $this->createMock(MessageDispatchInterface::class);
        $this->storage = $this->createMock(UserProfileTokenStorageInterface::class);
    }

    public function testCreateQueryBuilder(): void
    {

        $dbalQueryBuilder = new DBALQueryBuilder(
            env: 'test',
            connection: $this->connection,
            switcher: $this->switcher,
            translator: $this->translator,
            cache: $this->cache,
            deduplicator: $this->deduplicator,
            dispatch: $this->dispatch,
            UserProfileTokenStorageInterface: $this->storage,
            projectProfile: null,
        );

        $newInstance = $dbalQueryBuilder->createQueryBuilder('test-class');

        $this->assertInstanceOf(DBALQueryBuilder::class, $newInstance);
        $this->assertNotSame($dbalQueryBuilder, $newInstance);
        $this->assertEquals(md5('test-class'), $newInstance->getCacheKey());

    }

}
