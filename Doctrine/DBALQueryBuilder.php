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

namespace BaksDev\Core\Doctrine;

use App\Kernel;
use BaksDev\Core\Cache\AppCacheInterface;
use BaksDev\Core\Form\Search\SearchDTO;
use BaksDev\Core\Services\Switcher\SwitcherInterface;
use BaksDev\Core\Type\Locale\Locale;
use DateInterval;
use Doctrine\DBAL\Cache\QueryCacheProfile;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Query\QueryBuilder;
use Doctrine\DBAL\Result;
use Doctrine\ORM\Mapping\Table;
use Generator;
use InvalidArgumentException;
use Psr\Cache\CacheItemPoolInterface;
use ReflectionAttribute;
use ReflectionClass;
use Symfony\Component\Cache\Adapter\ApcuAdapter;
use Symfony\Component\Cache\CacheItem;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\Translation\TranslatorInterface;

final class DBALQueryBuilder extends QueryBuilder
{
    private Connection $connection;

    private CacheItemPoolInterface $cacheQueries;

    private string $cacheKey;

    private int $ttl;

    /**  Флаг кеширования запроса  */
    private bool $isCache = false;

    private $namespace;

    /** Билдер поиска */
    private ?QueryBuilder $search = null;

    private SwitcherInterface $switcher;

    /** Строка поиска */
    private SearchDTO $query;

    private TranslatorInterface $translator;

    /** Количество результатов */
    private ?int $counter = null;

    private string $env;


    private AppCacheInterface $cache;


    public function __construct(
        Connection $connection,
        SwitcherInterface $switcher,
        TranslatorInterface $translator,
        AppCacheInterface $cache,
        #[Autowire(env: 'APP_ENV')] string $env = 'test',
    )
    {
        $this->connection = $connection;
        $this->switcher = $switcher;
        $this->translator = $translator;
        $this->env = $env;
        $this->cache = $cache;

        parent::__construct($this->connection);
    }

    public function createQueryBuilder(object|string $class): self
    {
        $newInstance = new self(
            $this->connection,
            $this->switcher,
            $this->translator,
            $this->cache,
            $this->env
        );

        $newInstance->resetQueryParts();
        $newInstance->setParameters([]);

        $newInstance->cacheKey = str_replace('\\', '.', is_object($class) ? $class::class : $class);
        $newInstance->namespace = 'DBALCache';

        return $newInstance;
    }

    /**
     * Кешируем результат DBAL
     */

    public function enableCache(string $namespace = null, int $ttl = 86400): self
    {
        $this->isCache = true;
        $this->ttl = $ttl + random_int(0, $ttl); // разбрасываем время кеша

        if($namespace)
        {
            $this->namespace = $namespace;
        }

        /** Кешируем в редис */
        $this->cacheQueries = $this->cache->init($this->namespace, $ttl);

        $this->cacheKey .= '.'.implode('.', array_map(function($value) {
                return is_array($value) ? json_encode($value, JSON_THROW_ON_ERROR) : $value;
            }, $this->getParameters()));


        $DatetimeCache = new ApcuAdapter();

        $lastDatetimeCache = $DatetimeCache->getItem('date.'.$this->cacheKey);
        $lastDatetime = $lastDatetimeCache->get();

        if($lastDatetime === null || time() > $lastDatetime)
        {
            /* Перезаписываем метку времени запроса */
            $lastDatetimeCache->set(time() + random_int(3, 10));
            $lastDatetimeCache->expiresAfter($this->ttl);
            $DatetimeCache->save($lastDatetimeCache);

            if($lastDatetime)
            {
                /* Сбрасываем кеш для последующего запроса */
                register_shutdown_function([$this, 'resetCacheQuery'], 'throw');
                register_shutdown_function([$this, 'resetCounter'], 'throw');
            }
        }

        $this->connection->getConfiguration()?->setResultCache($this->cacheQueries);

        return $this;
    }

    /**
     * Перезаписываем кеш
     */
    public function resetCacheQuery(): bool
    {
        /* Не сбрасываем кеш если тестовая среда */
        if($this->env === 'test')
        {
            return true;
        }

        $this->connection->getConfiguration()?->setResultCache($this->cacheQueries);
        $this->deleteCacheQueries(); // Удаляем
        $this->executeCacheQuery(); // Сохраняем

        return true;
    }


    public function fetchAllAssociative(): array
    {
        $result = $this->isCache ?
            $this->executeCacheQuery()->fetchAllAssociative() :
            $this->executeQuery()->fetchAllAssociative();

        return $result ?: [];
    }


    public function fetchAllHydrate(string $class): Generator
    {
        $result = $this->isCache ?
            $this->executeCacheQuery()->iterateAssociative() :
            $this->executeQuery()->iterateAssociative();

        foreach($result as $item)
        {
            yield new $class(...$item);
        }
    }

    public function fetchHydrate(string $class): mixed
    {
        $result = $this->isCache ?
            $this->executeCacheQuery()->fetchAssociative() :
            $this->executeQuery()->fetchAssociative();

        return new $class(...$result);

    }


    public function fetchAssociative(): ?array
    {
        $this->setMaxResults(1);

        $result = $this->isCache ?
            $this->executeCacheQuery()->fetchAssociative() :
            $this->executeQuery()->fetchAssociative();

        return $result ?: null;
    }

    public function fetchAllAssociativeIndexed(?string $class = null): array
    {

        $result = $this->isCache ?
            $this->executeCacheQuery()->fetchAllAssociative() :
            $this->executeQuery()->fetchAllAssociative();

        $data = [];

        if($class)
        {
            $reflectionClass = new ReflectionClass($class);
        }

        foreach($result as $row)
        {
            if($class)
            {
                $object = $reflectionClass->newInstanceArgs($row);
                $data[array_shift($row)] = $object;
                continue;
            }

            $data[array_shift($row)] = $row;
        }

        return $data ?: [];

    }

    public function fetchOne(): mixed
    {
        $result = $this->isCache ?
            $this->executeCacheQuery()->fetchOne() :
            $this->executeQuery()->fetchOne();

        return $result ?: null;
    }

    public function fetchExist($not = false): bool
    {
        $this->select('1');

        $exist = $this->connection->createQueryBuilder();
        $exist->resetQueryParts();
        $exist->select(($not ? 'NOT ' : '').' EXISTS('.$this->getSQL().')');
        $exist->setParameters($this->getParameters());

        return (bool) $exist->executeQuery()->fetchOne();
    }

    private function executeCacheQuery(): Result
    {
        if($this->search)
        {
            $this->andWhere('('.$this->search->getQueryPart('where').')');
            $this->search = null;
        }

        return $this->connection->executeCacheQuery(
            $this->getSQL(),
            $this->getParameters(),
            $this->getParameterTypes(),
            new QueryCacheProfile($this->ttl, $this->cacheKey)
        );
    }

    public function deleteCacheQueries(): void
    {
        $this->cacheQueries->deleteItem($this->cacheKey);
        //$this->cacheQueries->clear();
    }

    public function resetCacheCounter(): void
    {
        /* Не сбрасываем кеш если тестовая среда */
        if(Kernel::isTestEnvironment())
        {
            return;
        }

        /* Сбрасываем кеш для последующего запроса */
        register_shutdown_function([$this, 'resetCounter'], 'throw');
    }

    public function resetCounter()
    {
        $counterKey = 'counter.'.$this->cacheKey;

        $DatetimeCache = new ApcuAdapter();


        $lastDatetimeCache = $DatetimeCache->getItem($counterKey);

        /** @var CacheItem $lastDatetime */
        if(!$lastDatetimeCache->isHit())
        {
            $this->select('COUNT(*)');
            $this->setMaxResults(null);
            $this->resetQueryParts(['orderBy', 'groupBy']);

            $counterCache = $this->cacheQueries->getItem($counterKey);
            $counterCache->set($this->fetchOne());
            $counterCache->expiresAfter(DateInterval::createFromDateString('1 day'));
            $this->cacheQueries->save($counterCache);

            // $lastDatetimeCache->expiresAfter(\DateInterval::createFromDateString('5 minutes'));
            $lastDatetimeCache->expiresAfter(DateInterval::createFromDateString('5 seconds'));
            $lastDatetimeCache->set(true);
            $DatetimeCache->save($lastDatetimeCache);
        }
    }


    /**
     * Создает SearchQueryBuilder для поиска, и добавляет в открытый запрос
     */
    public function createSearchQueryBuilder(SearchDTO $query): self
    {
        $this->query = $query;

        $integer = preg_replace("/[^0-9]/", "", $this->query->query);

        if($integer == $this->query->query)
        {
            $integer = (int) $integer < 2147483647 ? (int) $integer : false;

            if($integer)
            {
                $this->query->setQuery($integer);
            }
        }


        if(is_int($this->query->query) || $this->query->isUid())
        {
            $this->setParameter('equal', $this->query->query);
        }
        //else
        //{
        $this->setParameter('query', '%'.$this->switcher->toRus($this->query->query).'%');
        $this->setParameter('switcher', '%'.$this->switcher->toEng($this->query->query).'%');
        //}

        $this->search = new QueryBuilder($this->connection);

        return $this;
    }

    public function allGroupByExclude(string|array $exclude = null): void
    {
        $array = array("MIN", "MAX", "COUNT", "SUM", "JSON_AGG", "EXISTS");

        foreach($this->getQueryPart('select') as $field)
        {
            foreach($array as $value)
            {
                if(strpos($field, $value) !== false)
                {
                    continue 2;
                }
            }

            $case = stripos($field, "CASE");


            if($case)
            {
                $arrWhen = explode('WHEN', $field);

                foreach($arrWhen as $item)
                {
                    $field = trim($item);

                    if($field === 'CASE')
                    {
                        continue;
                    }

                    //                    $else = stripos($field, "ELSE");
                    //
                    //                    if($else)
                    //                    {
                    //
                    //                        $else = trim(substr(strstr($field, 'ELSE'), strlen('ELSE')));
                    //                        $else = substr($else, 0, strpos($else, ' '));
                    //
                    //
                    //                        dd($else);
                    //
                    //
                    ////                        dump($field);
                    //                        dump('$else');
                    //                        dd($field);
                    //                    }


                    $field = substr($field, 0, strpos($field, ' '));


                    $this->addGroupBy($field);


                }

                continue;

                //$field = substr($field, strpos($field, "END") + 3);
                // $field = trim(str_ireplace(' AS', '', $field));
            }


            $endAs = stripos($field, "END");

            if($endAs)
            {
                $field = substr($field, strpos($field, "END") + 3);
                $field = trim(str_ireplace(' AS', '', $field));
            }

            $as = stripos($field, " AS ");

            if($as)
            {
                $field = trim(substr($field, 0, $as));
            }

            if($field === $exclude)
            {
                continue;
            }

            $this->addGroupBy($field);
        }


    }


    /**  Example Builder:
     * $qb->leftJoin(
     * 'part_event',
     * ManufacturePartProduct::TABLE,
     * 'part_product',
     * 'part_product.id =
     * (
     * SELECT tmp.id
     * FROM '.ManufacturePartProduct::TABLE.' tmp WHERE tmp.event = part_event.id
     * ORDER BY tmp.id DESC
     * LIMIT 1
     * )
     * '
     * );
     */
    public function leftOneJoin(
        $fromAlias,
        $join,
        $alias,
        $condition,
        $sort = 'id',
        $desc = 'DESC'
    )
    {
        $leftOneJoin = new QueryBuilder($this->connection);

        $leftOneJoin
            ->select('tmp_'.$alias.'.id')
            ->from($join, 'tmp_'.$alias)
            ->where('tmp_'.trim($condition))
            ->orderBy('tmp_'.$alias.'.'.$sort, $desc)
            ->setMaxResults(1);

        $this->leftJoin(
            $fromAlias,
            $join,
            $alias,
            $alias.'.id = ('.$leftOneJoin->getSQL().')'
        );

        return $this;
    }


    /**
     * Добавляет к поиску строку для поиска соответствий LIKE
     */
    public function addSearchLike(string $field): self
    {
        if(!$this->search)
        {
            throw new InvalidArgumentException('Необходимо вызвать createSearchQueryBuilder с параметром SearchDTO');
        }

        $this->search->orWhere('LOWER('.$field.') LIKE :query');
        $this->search->orWhere('LOWER('.$field.') LIKE :switcher');


        return $this;
    }

    /**
     * Добавляет к поиску идентификатор UID
     */
    public function addSearchEqualUid(string $field): self
    {
        if(!$this->search)
        {
            throw new InvalidArgumentException('Необходимо вызвать createSearchQueryBuilder с параметром SearchDTO');
        }

        if($this->query->isUid())
        {
            $this->search->orWhere($field.' = :equal');
        }

        return $this;
    }

    public function addSearchEqual(string|int $field): self
    {
        if(!$this->search)
        {
            throw new InvalidArgumentException('Необходимо вызвать createSearchQueryBuilder с параметром SearchDTO');
        }

        $numbers = filter_var($this->query->getQuery(), FILTER_SANITIZE_NUMBER_INT);

        if(is_string($numbers))
        {
            $numbers = (int) $numbers;
        }

        if($numbers < 2147483647)
        {
            $this->search->orWhere($field.' = :equals');
            $this->setParameter('equals', $numbers);
        }

        return $this;
    }


    /**
     * Возвращает новый QueryBuilder (не участвует в открытом запросе)
     */
    public function builder(): QueryBuilder
    {
        return new QueryBuilder($this->connection);
    }

    /**
     * Метод создает параметр для запроса согласно локали Local
     */
    public function bindLocal(): self
    {
        $this->setParameter('local', new Locale($this->translator->getLocale()), Locale::TYPE);
        return $this;
    }

    /**
     * CacheQueries
     */
    public function getCacheQueries(): CacheItemPoolInterface
    {
        return $this->cacheQueries;
    }

    /**
     * CacheKey
     */
    public function getCacheKey(): string
    {
        return $this->cacheKey;
    }

    public function from($from, $alias = null): self
    {
        $this->add('from', [
            'table' => $this->getTableNameFromClass($from),
            'alias' => $alias,
        ], true);

        return $this;
    }

    public function leftJoin($fromAlias, $join, $alias, $condition = null): self
    {
        $this->add('join', [
            $fromAlias => [
                'joinType'      => 'left',
                'joinTable'     => $this->getTableNameFromClass($join),
                'joinAlias'     => $alias,
                'joinCondition' => $condition,
            ],
        ], true);

        return $this;
    }

    public function join($fromAlias, $join, $alias, $condition = null): self
    {
        $this->innerJoin(
            $fromAlias,
            $this->getTableNameFromClass($join),
            $alias,
            $condition
        );

        return $this;
    }

    private function getTableNameFromClass(string $class): string
    {
        if(class_exists($class))
        {
            $ref = new ReflectionClass($class);
            /** @var ReflectionAttribute $current */
            $current = current($ref->getAttributes(Table::class));
            return $current->getArguments()['name'] ?? $class;
        }

        return $class;
    }
}