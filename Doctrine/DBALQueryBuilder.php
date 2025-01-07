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

namespace BaksDev\Core\Doctrine;

use BaksDev\Core\Cache\AppCacheInterface;
use BaksDev\Core\Deduplicator\DeduplicatorInterface;
use BaksDev\Core\Form\Search\SearchDTO;
use BaksDev\Core\Services\Switcher\SwitcherInterface;
use BaksDev\Core\Type\Locale\Locale;
use DateInterval;
use Doctrine\DBAL\ArrayParameterType;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;
use Doctrine\DBAL\Query\QueryBuilder;
use Doctrine\DBAL\Result;
use Doctrine\DBAL\Statement;
use Doctrine\ORM\Mapping\Table;
use Generator;
use InvalidArgumentException;
use Psr\Cache\CacheItemPoolInterface;
use Psr\Log\LoggerInterface;
use Random\Randomizer;
use ReflectionAttribute;
use ReflectionClass;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\DependencyInjection\Attribute\Target;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

final class DBALQueryBuilder extends QueryBuilder
{
    private Connection $connection;

    private array $select = [];

    /**  Кеш запросов */

    private CacheInterface|CacheItemPoolInterface $cacheQueries;

    private string $cacheKey;

    private ?string $namespace;

    private int $ttl;

    /**  Флаг кеширования запроса */
    private bool $isCache = false;

    /** Метод, который вызывается для обновления кеша */
    private string|bool $methodReset = false;

    /** Флаг, сбрасывающий deduplicator при shutdown */
    private bool $refresh = true;


    /** Поиск */
    private SearchDTO $query;
    private ?QueryBuilder $search = null;

    /** Билдер рекурсии */
    private ?string $recursive = null;
    private ?string $recursive_alias = null;


    public function __construct(
        #[Autowire(env: 'APP_ENV')] private readonly string $env,
        #[Target('coreLogger')] private readonly LoggerInterface $logger,
        private readonly SwitcherInterface $switcher,
        private readonly TranslatorInterface $translator,
        private readonly AppCacheInterface $cache,
        private readonly DeduplicatorInterface $deduplicator,
        Connection $connection,
    )
    {
        $this->connection = $connection;

        parent::__construct($this->connection);
    }

    public function createQueryBuilder(object|string $class): self
    {
        $newInstance = new self(
            env: $this->env,
            logger: $this->logger,
            switcher: $this->switcher,
            translator: $this->translator,
            cache: $this->cache,
            deduplicator: $this->deduplicator,
            connection: $this->connection
        );

        $this->isCache = false;

        $newInstance->resetOrderBy();
        $newInstance->resetGroupBy();
        $newInstance->resetWhere();
        $newInstance->setParameters([]);

        $classNamespace = is_object($class) ? $class::class : $class;

        $newInstance->namespace = $this->getCacheNamespace($classNamespace);
        $newInstance->cacheKey = $classNamespace;

        return $newInstance;
    }

    private function getCacheNamespace(string $class)
    {
        if(class_exists($class))
        {
            /** Выделяем из namespace класса название модуля */
            $reflect = new ReflectionClass($class);

            if(preg_match('/vendor\/baks-dev\/([^\/]+)\//', $reflect->getFileName(), $matches))
            {
                return $matches[1];
            }
        }

        return $class;
    }


    /**
     * Кешируем результат DBAL
     */

    public function enableCache(?string $namespace = null, int|string $ttl = '1 day', bool $refresh = true): self
    {
        /** Переопределяем кеш модуля */
        if($namespace)
        {
            $this->namespace = $this->getCacheNamespace($namespace);
        }

        $this->isCache = true;
        $this->refresh = $refresh;

        $ttl = $this->getTimeToLive($ttl);
        $this->cacheQueries = $this->cache->init($this->namespace, $ttl);

        $this->ttl = $this->getTimeToLive($ttl);

        if(empty($this->select))
        {
            $this->select('*');
        }

        /** Создаем ключ кеша конкатенируя параметры и присваиваем дайджест  */
        $this->cacheKey .= '.'.md5(var_export([$this->getSQL(), $this->getParameters()], true));

        register_shutdown_function(function() {

            if(false === $this->isCache)
            {
                return;
            }

            if('test' === $this->env)
            {
                return;
            }

            if(false === $this->methodReset)
            {
                return;
            }

            $Randomizer = new Randomizer();
            $max = (int) ($this->ttl / 2);
            $max = max($max, 5);
            $expires = $Randomizer->getInt(3, $max);

            $Deduplicator = $this->deduplicator
                ->namespace($this->namespace)
                ->expiresAfter(sprintf('%s seconds', $expires))
                ->deduplication([$this->methodReset, $this->cacheKey]);

            if($Deduplicator->isExecuted())
            {
                $this->logger->critical('КЕШ ЕЩЕ ОБНОВЛЯЕТСЯ', [$this->cacheKey]);
                return;
            }

            $Deduplicator->save();

            /** Прогреваем кеш REFRESH кеш */

            $this->isCache = false;
            $data = $this->{$this->methodReset}();
            $this->isCache = true;


            /** Присваиваем АКТИВНЫЙ кеш */
            $current = $this->cacheQueries->getItem($this->cacheKey);

            $current
                ->expiresAfter($this->ttl)
                ->set($data);

            $this->logger->critical('ОБНОВИЛИ РЕЗУЛЬТАТ', [$this->cacheKey]);

            $this->cacheQueries->save($current);

            if($this->refresh)
            {
                register_shutdown_function(function() {

                    $this->deduplicator
                        ->namespace($this->namespace)
                        ->deduplication([$this->methodReset, $this->cacheKey])
                        ->delete();

                    $this->logger->critical('СБРОСИЛИ дедубликтор для последующего обновления', [$this->cacheKey]);
                });
            }
        });


        return $this;
    }


    /**
     * Перезаписываем кеш
     */
    public function resetCacheQuery(): bool
    {
        if($this->env === 'test')
        {
            return false;
        }

        if($this->isCache === false)
        {
            return false;
        }

        $this->cacheQueries->deleteItem($this->cacheKey);

        return true;
    }

    private function getTimeToLive(string|int $seconds): int
    {
        if(is_string($seconds))
        {
            $interval = DateInterval::createFromDateString($seconds);

            $seconds =
                ($interval->d * 86400) + // дни в секундах
                ($interval->h * 3600) +  // часы в секундах
                ($interval->i * 60) +    // минуты в секундах
                $interval->s;            // секунды
        }

        $seconds = (int) $seconds;

        /**
         * Отключаем кеширование быть больше одних суток
         */
        if(empty($seconds) || $seconds > 86400)
        {
            $seconds = 86400;
        }

        /**
         * Делаем разброс по времени
         */
        $Randomizer = new Randomizer();
        $seconds = $Randomizer->getInt($seconds, ($seconds * 2));

        return $seconds;
    }

    public function fetchAllAssociative(): array
    {
        $this->methodReset = 'fetchAllAssociative';

        $result = $this->isCache ? $this->cacheQueries->get($this->cacheKey, function(ItemInterface $item): mixed {
            $this->methodReset = false;
            $item->expiresAfter($this->ttl);
            return $this->executeDBALQuery()->fetchAllAssociative();
        }) : $this->executeDBALQuery()->fetchAllAssociative();

        //$result = $this->executeDBALQuery()->fetchAllAssociative();

        return $result ?: [];
    }

    /**
     * Метод гидрации
     */

    public function fetchAllHydrate(string $class, ?string $method = null): Generator
    {
        $result = $this->fetchAllGenerator();

        foreach($result as $item)
        {
            yield $method ? (new $class())->{$method}(...$item) : new $class(...$item);
        }
    }

    public function fetchAllIndexHydrate(string $class): array|false
    {
        $result = $this->fetchAllAssociativeIndexed();

        foreach($result as $key => $item)
        {
            $result[$key] = new $class(...$item);
        }

        return $result ?: false;
    }

    public function fetchHydrate(string $class, ?string $method = null): mixed
    {
        $result = $this->fetchAssociative();

        if(empty($result))
        {
            return false;
        }

        return $method ? (new $class())->{$method}(...$result) : new $class(...$result);
    }

    /**
     * Метод результатов запросов
     */

    public function fetchAllGenerator(): Generator|false
    {
        $this->methodReset = 'fetchAllGenerator';

        $result = $this->isCache ? $this->cacheQueries->get($this->cacheKey, function(ItemInterface $item): mixed {
            $this->methodReset = false;
            $item->expiresAfter($this->ttl);
            return $this->executeDBALQuery()->iterateAssociative();
        }) : $this->executeDBALQuery()->iterateAssociative();

        return $result->valid() ? $result : false;
    }

    public function fetchAssociative(): array|false
    {
        $this->methodReset = 'fetchAssociative';

        $result = $this->isCache ? $this->cacheQueries->get($this->cacheKey, function(ItemInterface $item): mixed {
            $this->methodReset = false;
            $item->expiresAfter($this->ttl);
            return $this->executeDBALQuery()->fetchAssociative();
        }) : $this->executeDBALQuery()->fetchAssociative();

        return $result ?: false;
    }

    public function fetchAllAssociativeIndexed(?string $class = null): array
    {
        $result = $this->fetchAllAssociative();

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
        $this->methodReset = 'fetchOne';

        $result = $this->isCache ? $this->cacheQueries->get($this->cacheKey, function(ItemInterface $item): mixed {
            $this->methodReset = false;
            $item->expiresAfter($this->ttl);
            return $this->executeDBALQuery()->fetchOne();
        }) : $this->executeDBALQuery()->fetchOne();

        return $result ?: false;
    }

    public function fetchExist($not = false): bool
    {
        $this->select('1');

        $exist = $this->connection->createQueryBuilder();

        //$exist->resetQueryParts();

        $exist->resetOrderBy();
        $exist->resetGroupBy();
        $exist->resetHaving();
        $exist->resetWhere();

        $exist->select(($not ? 'NOT ' : '').' EXISTS('.$this->getSQL().')');
        $exist->setParameters($this->getParameters());

        $result = $this->executeDBALQuery()->fetchOne();

        return (bool) $result;
    }

    private function executeDBALQuery(): Result
    {
        if($this->search)
        {
            $WHERE = str_replace('SELECT NULL WHERE', '(', $this->search->getSQL()).')';
            $this->andWhere($WHERE);
        }

        return $this->executeQuery();

    }

    /**
     * Создает SearchQueryBuilder для поиска, и добавляет в открытый запрос
     */
    public function createSearchQueryBuilder(SearchDTO $query): self
    {
        $this->query = $query;

        $integer = preg_replace("/[^0-9]/", "", (string) $this->query->query);

        if($integer === $this->query->query)
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

        $this->setParameter('query', '%'.$this->switcher->toRus($this->query->query).'%');
        $this->setParameter('switcher', '%'.$this->switcher->toEng($this->query->query).'%');

        $this->search = new QueryBuilder($this->connection);

        $this->search->select('NULL');

        return $this;
    }

    /**
     * Метод добавляет условие рекурсивного запроса
     */
    public function joinRecursive($fromAlias, $join, $alias, $condition = null): self
    {
        $this->recursive_alias = $alias;

        $this->join(
            $fromAlias,
            $this->table($join),
            $alias,
            $condition
        );

        return $this;
    }


    /**
     * @param $id - идентификатор сущности
     * @param $parent - идентификатор свойства на основную сущность
     * @throws Exception
     */
    public function findAllRecursive(array $condition): array|false
    {
        $parent = key($condition);
        $id = current($condition);

        $dbal_union = clone $this;

        $this->andWhere($this->recursive_alias.'.'.$parent.' IS NULL');

        $dbal_union->join(
            $this->recursive_alias,
            'recursive_table',
            '',
            'recursive_table.'.$id.' = '.$this->recursive_alias.'.'.$parent
        );


        $dbal_union->resetWhere();

        $sql = "WITH RECURSIVE recursive_table AS (";
        $sql .= $this->getSQL();
        $sql .= ' UNION ';
        $sql .= $dbal_union->getSQL();
        $sql .= ') SELECT * FROM recursive_table ORDER BY 
         
                    CASE 
					    WHEN recursive_table.'.$parent.' IS NOT NULL 
					    THEN recursive_table.'.$parent.'
					    ELSE recursive_table.'.$id.'
					    
					END, 
					
					recursive_table.sort, 
					recursive_table.'.$id.'
        ';


        $Statement = $this->prepare($sql);

        foreach($this->getParameters() as $param => $value)
        {
            $Statement->bindValue($param, $value);
        }

        return $Statement
            ->executeQuery()
            ->fetchAllAssociative() ?: false;
    }


    public function select(string ...$expressions): self
    {
        $this->select = $expressions;
        parent::select(...$expressions);

        return $this;
    }

    public function addSelect(string $expression, string ...$expressions): self
    {
        $this->select = array_merge($this->select, [$expression], $expressions);

        parent::addSelect($expression, ...$expressions);

        return $this;
    }


    public function allGroupByExclude(string|array|null $exclude = null): void
    {

        $array = [
            "MIN", "MAX", "COUNT", "SUM",

            "JSON_AGG",
            "ARRAY_AGG",
            "STRING_AGG",

            "EXISTS", "FALSE", "TRUE",
            //"COALESCE"
        ];

        $addGroupBy = null;

        foreach($this->select as $field)
        {
            foreach($array as $value)
            {
                if(strpos($field, $value) !== false)
                {
                    continue 2;
                }
            }

            preg_match_all('/\b(\w+\.\w+)\b/', $field, $matches);
            $result = $matches[1];

            foreach($result as $r)
            {
                $addGroupBy[] = $r;
            }
        }

        if($addGroupBy)
        {
            $addGroupBy = array_unique($addGroupBy);
            $this->addGroupBy(...$addGroupBy);
        }
    }


    /**  Example Builder:
     * $qb->leftJoin(
     * 'part_event',
     * ManufacturePartProduct::class,
     * 'part_product',
     * 'part_product.id =
     * (
     * SELECT tmp.id
     * FROM '.ManufacturePartProduct::class.' tmp WHERE tmp.event = part_event.id
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
        $identifier = 'id',
        $sort = null,
        $desc = 'DESC'
    )
    {
        $leftOneJoin = new QueryBuilder($this->connection);

        $leftOneJoin
            ->select('tmp_'.$alias.'.'.$identifier)
            ->from($this->table($join), 'tmp_'.$alias)
            ->where('tmp_'.trim($condition))
            ->orderBy('tmp_'.$alias.'.'.($sort ?: $identifier), $desc)
            ->setMaxResults(1);

        $this->leftJoin(
            $fromAlias,
            $join,
            $alias,
            $alias.'.'.$identifier.' = ('.$leftOneJoin->getSQL().')'
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

    /**
     * Добавляет к поиску идентификатор UID
     */
    public function addSearchInArray(string $field, array $search): self
    {
        if(!$this->search)
        {
            throw new InvalidArgumentException('Необходимо вызвать createSearchQueryBuilder с параметром SearchDTO');
        }

        $this->search->where($field.' IN(:search)');
        $this->setParameter('search', $search, ArrayParameterType::STRING);

        /** Сортируем в порядке релевантности*/
        $orderString = "CASE ".$field;

        foreach($search as $key => $value)
        {
            $orderString .= " WHEN '$value' THEN $key ";
        }

        $orderString .= "END";

        $this->orderBy($orderString);


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

    public function setCacheKey(string $cacheKey): self
    {
        $this->cacheKey = $cacheKey;
        return $this;
    }


    public function from(string $table, $alias = null): self
    {
        $from = $this->table($table);

        parent::from($from, $alias);

        return $this;
    }

    public function update(string $table): self
    {
        $from = $this->table($table);

        parent::update($from);

        return $this;
    }

    public function delete(string $table): self
    {
        $from = $this->table($table);

        parent::delete($from);

        return $this;
    }


    private function buildExist($existClass, $alias, $condition): string
    {
        $exist = $this->createQueryBuilder(self::class);

        $exist->select('1');
        $exist->from($this->table($existClass), $alias);
        $exist->where($condition);

        return $exist->getSQL();
    }

    public function andWhereExists($existClass, $alias, $condition): DBALQueryBuilder
    {
        $this->andWhere('EXISTS('.$this->buildExist($existClass, $alias, $condition).')');
        return $this;
    }

    public function andWhereNotExists($existClass, $alias, $condition = null): DBALQueryBuilder
    {
        $this->andWhere('NOT EXISTS('.$this->buildExist($existClass, $alias, $condition).')');
        return $this;
    }

    public function leftJoin($fromAlias, $join, $alias, $condition = null): self
    {
        $table = $this->table($join);

        parent::leftJoin(
            $fromAlias,
            $table,
            $alias,
            $condition
        );

        return $this;
    }

    public function join($fromAlias, $join, $alias, $condition = null): self
    {
        $this->innerJoin(
            $fromAlias,
            $this->table($join),
            $alias,
            $condition
        );

        return $this;
    }


    public function analyze(): void
    {
        //dd($this->getParameters());

        $connection = $this->connection->prepare('EXPLAIN (ANALYZE)  '.$this->getSQL());

        foreach($this->getParameters() as $param => $value)
        {
            $connection->bindValue($param, $value);
        }

        $analyze = $connection->executeQuery()->fetchAllAssociativeIndexed();

        dd($analyze);
    }

    public function table(string $class): string
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

    public function prepare(string $sql): Statement
    {
        return $this->connection->prepare($sql);
    }


}
