<?php
/*
 *  Copyright 2024.  Baks.dev <admin@baks.dev>
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
use BaksDev\Core\Services\Switcher\SwitcherInterface;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Query\QueryBuilder;
use PHPUnit\Framework\TestCase;
use Psr\Cache\CacheItemPoolInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\When;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

/** @group core */
#[When(env: 'test')]
final class DBALQueryBuilderTest extends TestCase
{
    private Connection $connection;
    private CacheItemPoolInterface $cacheQueries;
    private string $cacheKey;
    private int $ttl;
    private bool $isCache;
    private string $namespace;
    private QueryBuilder $search;
    private TranslatorInterface $translator;
    private SwitcherInterface $switcher;
    private int $counter;
    private AppCacheInterface $cache;
    private LoggerInterface $logger;
    private HttpClientInterface $client;

    protected function setUp(): void
    {
        $this->connection = $this->createMock(Connection::class);
        $this->cacheQueries = $this->createMock(CacheItemPoolInterface::class);
        $this->cacheKey = 'test_cache_key';
        $this->ttl = 900;
        $this->isCache = false;
        $this->namespace = 'DBALCache';
        $this->search = $this->createMock(QueryBuilder::class);
        $this->translator = $this->createMock(TranslatorInterface::class);
        $this->switcher = $this->createMock(SwitcherInterface::class);
        $this->cache = $this->createMock(AppCacheInterface::class);
        $this->logger = $this->createMock(LoggerInterface::class);
        $this->deduplicatop = $this->createMock(DeduplicatorInterface::class);
        $this->client = $this->createMock(HttpClientInterface::class);
        $this->counter = 0;
    }


    public function testCreateQueryBuilder(): void
    {
        $dbalQueryBuilder = new DBALQueryBuilder(
            env: 'test',
            logger: $this->logger,
            switcher: $this->switcher,
            translator: $this->translator,
            cache: $this->cache,
            deduplicator: $this->deduplicatop,
            connection: $this->connection,
        );

        $newInstance = $dbalQueryBuilder->createQueryBuilder('test-class');

        $this->assertInstanceOf(DBALQueryBuilder::class, $newInstance);
        $this->assertNotSame($dbalQueryBuilder, $newInstance);
        $this->assertEquals('test-class', $newInstance->getCacheKey());

    }

}
