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

use App\Kernel;
use BaksDev\Core\Cache\AppCacheInterface;
use BaksDev\Core\Deduplicator\DeduplicatorInterface;
use BaksDev\Core\Doctrine\DBAL\Cache\DBALCacheResetMessage;
use BaksDev\Core\Doctrine\DBAL\Delay\DBALDelayMessage;
use BaksDev\Core\Form\Search\SearchDTO;
use BaksDev\Core\Messenger\MessageDelay;
use BaksDev\Core\Messenger\MessageDispatchInterface;
use BaksDev\Core\Services\Switcher\SwitcherInterface;
use BaksDev\Core\Type\Locale\Locale;
use DateInterval;
use Doctrine\DBAL\ArrayParameterType;
use Doctrine\DBAL\Cache\QueryCacheProfile;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;
use Doctrine\DBAL\Query\QueryBuilder;
use Doctrine\DBAL\Result;
use Doctrine\DBAL\Statement;
use Doctrine\ORM\Mapping\Table;
use Generator;
use InvalidArgumentException;
use Psr\Cache\CacheItemPoolInterface;
use Random\Randomizer;
use ReflectionAttribute;
use ReflectionClass;
use Symfony\Component\DependencyInjection\Attribute\Autoconfigure;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

#[Autoconfigure(public: true)]
final class DBALQueryBuilder extends QueryBuilder
{
    private Connection $connection;

    private array $select = [];


    /**  Кеш запросов */

    private CacheInterface|CacheItemPoolInterface|false $cacheQueries = false;

    private string $cacheKey;

    private int $ttl = 60;

    /**  Флаг кеширования запроса  */
    private bool $isCache = false;

    private ?string $namespace;

    /** Поиск */
    private SearchDTO $query;
    private ?QueryBuilder $search = null;

    /** Билдер рекурсии */
    private ?string $recursive = null;
    private ?string $recursive_alias = null;


    /** Метод, который вызывается для обновления кеша */
    private string|bool $methodReset = false;

    private bool $refresh = true;

    public function __construct(
        #[Autowire(env: 'APP_ENV')] private readonly string $env,
        Connection $connection,
        private readonly SwitcherInterface $switcher,
        private readonly TranslatorInterface $translator,
        private readonly AppCacheInterface $cache,
        private readonly DeduplicatorInterface $deduplicator,
        private readonly MessageDispatchInterface $dispatch,
    )
    {
        $this->connection = $connection;

        parent::__construct($this->connection);
    }

    public function createQueryBuilder(object|string $class): self
    {
        $newInstance = new self(
            env: $this->env,
            connection: $this->connection,
            switcher: $this->switcher,
            translator: $this->translator,
            cache: $this->cache,
            deduplicator: $this->deduplicator,
            dispatch: $this->dispatch,
        );

        //$newInstance->resetQueryParts();

        $newInstance->resetOrderBy();
        $newInstance->resetGroupBy();
        $newInstance->resetWhere();

        $newInstance->setParameters([]);

        $classNamespace = is_object($class) ? $class::class : $class;

        $newInstance->namespace = $this->getCacheNamespace($classNamespace);
        $newInstance->cacheKey = md5($classNamespace);

        $this->isCache = false;

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

        if(empty($this->select))
        {
            $this->select('*');
        }

        $this->isCache = true;
        $this->refresh = $refresh;

        $ttl = $this->getTimeToLive($ttl);
        $this->cacheQueries = $this->cache->init($this->namespace, $ttl);

        $this->ttl = $this->getTimeToLive($ttl);

        /** Создаем ключ кеша конкатенируя параметры и присваиваем дайджест  */
        $this->cacheKey = md5($this->cacheKey.var_export($this->getParameters(), true).$this->getMaxResults().$this->getFirstResult());
        $this->connection->getConfiguration()?->setResultCache($this->cacheQueries);

        return $this;

    }


    /**
     * Метод включает кеш результата запроса и добавляет комманду для обновления с низким приоритетом
     */
    private function executeDBALQuery(): Result
    {
        if($this->search)
        {
            $WHERE = str_replace('SELECT NULL WHERE', '(', $this->search->getSQL()).')';
            $this->andWhere($WHERE);
        }

        if($this->isCache && !$this->search)
        {
            $Deduplicator = $this->deduplicator
                ->namespace($this->namespace)
                ->expiresAfter(sprintf('%d seconds', $this->ttl))
                ->deduplication([$this->cacheKey]);

            //$Deduplicator->delete();

            /** Обновляем кеш результата запроса */
            if(false === $Deduplicator->isExecuted())
            {
                $Deduplicator->save();

                $DBALCacheResetMessage = new DBALCacheResetMessage($this->namespace, $this->cacheKey);

                $this->dispatch->dispatch(
                    $DBALCacheResetMessage,
                    stamps: $this->refresh ? [] : [new MessageDelay(sprintf('%d seconds', ($this->ttl / 2)))],
                    transport: $this->namespace.'-low'
                );
            }

            return $this->executeCacheQuery();
        }


        return $this->executeQuery();
    }


    /**
     * Метод возвращает время в секундах с разбросом * 2
     */
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
         * Ограничиваем кеширование больше одних суток
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

    /**
     * Сбрасываем тек ключа запроса
     */
    public function resetCacheQuery(): bool
    {
        /* Не сбрасываем кеш если тестовая среда */
        if($this->env === 'test')
        {
            return true;
        }

        $this->connection->getConfiguration()->setResultCache($this->cacheQueries);
        $this->deleteCacheQueries(); // Удаляем

        return true;

        //$this->executeCacheQuery(); // Сохраняем
        //return true;
    }


    public function fetchAllAssociative(): array
    {
        $result = $this->executeDBALQuery()->fetchAllAssociative();

        return $result ?: [];
    }

    public function fetchAllGenerator(): Generator|false
    {
        $result = $this->executeDBALQuery()->iterateAssociative();

        return $result->valid() ? $result : false;
    }

    public function fetchAllHydrate(string $class, ?string $method = null): Generator
    {
        $result = $this->executeDBALQuery()->iterateAssociative();

        foreach($result as $item)
        {
            yield $method ? (new $class())->{$method}(...$item) : new $class(...$item);
        }
    }

    public function fetchAllIndexHydrate(string $class): array|false
    {
        $result = $this->executeDBALQuery()->fetchAllAssociativeIndexed();

        foreach($result as $key => $item)
        {
            $result[$key] = new $class(...$item);
        }

        return $result ?: false;
    }

    public function fetchHydrate(string $class, ?string $method = null): mixed
    {
        $result = $this->executeDBALQuery()->fetchAssociative();

        if(empty($result))
        {
            return false;
        }

        return $method ? (new $class())->{$method}(...$result) : new $class(...$result);
    }

    public function fetchAssociative(): array|false
    {
        $result = $this->executeDBALQuery()->fetchAssociative();

        return $result ?: false;
    }

    public function fetchAllAssociativeIndexed(?string $class = null): array
    {

        $result = $this->executeDBALQuery()->fetchAllAssociative();

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
        $result = $this->executeDBALQuery()->fetchOne();

        return $result ?: false;
    }

    public function count(bool $delay = false): int|null
    {
        $this->select('COUNT(*)');

        $this->setMaxResults(null);
        $this->setFirstResult(0);

        $this->resetGroupBy();
        $this->resetOrderBy();

        $this->enableCache();

        $cache = $this->cacheQueries->getItem($this->cacheKey);

        if($delay)
        {
            $Deduplicator = $this->deduplicator
                ->namespace($this->namespace)
                ->expiresAfter(sprintf('%d seconds', $this->ttl))
                ->deduplication([$this->cacheKey]);


            /** Обновляем кеш результата запроса */
            if(false === $cache->isHit() || false === $Deduplicator->isExecuted())
            {
                $Deduplicator->save();

                $stamps = [];

                if($cache->isHit())
                {
                    $Randomise = new Randomizer();
                    $ttl = $Randomise->getInt(5, (int) ($this->ttl / 2));
                    $stamps = [new MessageDelay(sprintf('%d seconds', ($ttl)))];
                }

                $DBALDelayMessage = new DBALDelayMessage(
                    $this->namespace,
                    $this->cacheKey,
                    $this->getSQL(),
                    $this->getParameters(),
                    $this->getParameterTypes()
                );

                $this->dispatch->dispatch(
                    message: $DBALDelayMessage,
                    stamps: $stamps,
                    transport: $this->namespace.'-low'
                );
            }
        }

        return false === $delay || $cache->isHit() ? (int) $this->fetchOne() : null;
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


    public function executeCacheQuery(
        string|false $sql = false,
        array|false $params = false,
        array|false $types = false
    ): Result
    {
        return $this->connection->executeCacheQuery(
            $sql ?: $this->getSQL(),
            $params ?: $this->getParameters(),
            $types ?: $this->getParameterTypes(),
            new QueryCacheProfile($this->ttl, $this->cacheKey)
        );
    }

    public function setCacheQueries(CacheInterface|CacheItemPoolInterface $cacheQueries): self
    {
        $this->connection->getConfiguration()?->setResultCache($cacheQueries);
        return $this;
    }

    public function deleteCacheQueries(): void
    {
        $this->cacheQueries->deleteItem($this->cacheKey);
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

        $bind = $this->query->query ?: '';

        if(!empty($this->query->query) && is_string($this->query->query))
        {
            $bind = str_replace('?', '%', $this->query->query ?: '');
        }

        $this->setParameter('query', '%'.$this->switcher->toRus($bind).'%');
        $this->setParameter('switcher', '%'.$this->switcher->toEng($bind).'%');

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

        $string = $this->recursive_alias.'.'.$id.'::varchar AS groups';

        // Удаляем символы \t, \r, \n и заменяем двойные пробелы на одинарные
        //$string = preg_replace("/[\t\r\n]+/", '', $string); // Удаляем \t, \r, \n
        //$string = preg_replace('/ +/', ' ', $string); // Заменяем несколько пробелов на один

        // Удаляем пробелы в начале и конце строки
        //$string = trim($string);

        $this->addSelect($string);
        $this->addSelect('1 AS level');

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


        $groups = " CONCAT(groups, ':',  ".$this->recursive_alias.".".$id."::varchar) AS groups ";

        $sql .= str_replace(
            ['1 AS level', $string],
            ['level+1 AS level', $groups],
            $dbal_union->getSQL()
        );


        $sql .= ') SELECT * FROM recursive_table ORDER BY 
                    recursive_table.groups,
                    recursive_table.sort     
        ';

        $result = $this
            ->executeCacheQuery(
                $sql,
                $this->getParameters(),
                $this->getParameterTypes()
            )->fetchAllAssociative();

        return $result;
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
    public function getCacheQueries(): CacheItemPoolInterface|false
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

    public function setCacheKey(string $key): self
    {
        $this->cacheKey = $key;
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
