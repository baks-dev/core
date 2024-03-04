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
use BaksDev\Users\Profile\UserProfile\Entity\Info\UserProfileInfo;
use DateInterval;
use DateTimeImmutable;
use Doctrine\DBAL\ArrayParameterType;
use Doctrine\DBAL\Cache\QueryCacheProfile;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Query\Expression\CompositeExpression;
use Doctrine\DBAL\Query\QueryBuilder;
use Doctrine\DBAL\Query\QueryType;
use Doctrine\DBAL\Result;
use Doctrine\ORM\Mapping\Table;
use Generator;
use InvalidArgumentException;
use Psr\Cache\CacheItemPoolInterface;
use ReflectionAttribute;
use ReflectionClass;
use Symfony\Component\Cache\Adapter\ApcuAdapter;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\Cache\CacheItem;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\Translation\TranslatorInterface;

final class DBALQueryBuilder extends QueryBuilder
{

    private array $select = [];

    private string|CompositeExpression|null $where = null;


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

        //$newInstance->resetQueryParts();

        $newInstance->resetOrderBy();
        $newInstance->resetGroupBy();
        $newInstance->resetWhere();

        $newInstance->setParameters([]);

        $newInstance->cacheKey = str_replace('\\', '.', is_object($class) ? $class::class : $class);
        $newInstance->namespace = 'DBALCache';

        return $newInstance;
    }

    /**
     * Кешируем результат DBAL
     */

    public function enableCache(string $namespace = null, int $ttl = 86400, $refresh = true): self
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


                if($value instanceof DateTimeImmutable)
                {
                    $value = $value->getTimestamp();
                }

                return is_array($value) ? json_encode($value, JSON_THROW_ON_ERROR) : $value;


            }, $this->getParameters()));


        if($refresh)
        {
            $DatetimeCache = (function_exists('apcu_enabled') && apcu_enabled()) ? new ApcuAdapter() : new FilesystemAdapter();

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
        $result = $this->executeDBALQuery()->fetchAllAssociative();

        return $result ?: [];
    }


    public function fetchAllHydrate(string $class): Generator
    {
        $result = $this->executeDBALQuery()->iterateAssociative();

        foreach($result as $item)
        {
            yield new $class(...$item);
        }
    }

    public function fetchHydrate(string $class): mixed
    {
        $result = $this->executeDBALQuery()->fetchAssociative();

        if(empty($result))
        {
            return null;
        }

        return new $class(...$result);
    }


    public function fetchAssociative(): array|false
    {
        $this->setMaxResults(1);

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

        return $result ?: null;
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

        return $this->isCache && !$this->search ? $this->executeCacheQuery() : $this->executeQuery();
    }

    private function executeCacheQuery(): Result
    {
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

        $DatetimeCache = (function_exists('apcu_enabled') && apcu_enabled()) ? new ApcuAdapter() : new FilesystemAdapter();


        $lastDatetimeCache = $DatetimeCache->getItem($counterKey);

        /** @var CacheItem $lastDatetime */
        if(!$lastDatetimeCache->isHit())
        {
            $this->select('COUNT(*)');
            $this->setMaxResults(null);

            //$this->resetQueryParts(['orderBy', 'groupBy']);
            $this->resetOrderBy();
            $this->resetGroupBy();


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

        $this->search->select('NULL');

        return $this;
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


    public function allGroupByExclude(string|array $exclude = null): void
    {
        $array = [
            "MIN", "MAX", "COUNT", "SUM",
            "JSON_AGG", "ARRAY_AGG", "STRING_AGG",
            "EXISTS", "FALSE", "TRUE"
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

            $field = str_replace(array(PHP_EOL, "\t"), ' ', $field);
            $field = trim($field);
            $case = stripos($field, "CASE");


            if($case !== false)
            {
                $arrWhen = explode('WHEN', $field);


                foreach($arrWhen as $item)
                {
                    $fieldWhen = trim($item);

                    if($fieldWhen === 'CASE')
                    {
                        continue;
                    }

                    $fieldWhen = substr($fieldWhen, 0, strpos($fieldWhen, ' '));

                    //$this->addGroupBy(trim($fieldWhen));

                    $addGroupBy[] = trim($fieldWhen);
                }


                $arrThen = explode('THEN', $field);

                foreach($arrThen as $item)
                {
                    $item = trim($item);

                    $CONCAT = stripos($item, "CONCAT");

                    if($CONCAT)
                    {
                        continue;
                    }

                    $item = trim(str_replace(array(PHP_EOL, "(", ")"), ' ', $item));
                    $stripos = strpos($item, ' ');

                    if(!$stripos)
                    {
                        continue;
                    }

                    $fieldThen = substr($item, 0, $stripos);

                    $fieldThen = trim($fieldThen);

                    if($fieldThen === 'CASE' || $fieldThen === 'CONCAT')
                    {
                        continue;
                    }

                    if($fieldThen)
                    {
                        $addGroupBy[] = $fieldThen;
                        //$this->addGroupBy($fieldThen);
                    }
                }

                continue;
            }


            $endAs = stripos($field, "END");

            if($endAs)
            {
                $field = substr($field, strpos($field, "END") + 3);
                $field = trim(str_ireplace(' AS', '', $field));

                $dot = stripos($field, '.');

                if(!$dot)
                {
                    continue;
                }

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

            $addGroupBy[] = $field;
            //$this->addGroupBy($field);
        }

        $addGroupBy = array_unique($addGroupBy);
        $this->addGroupBy(...$addGroupBy);

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
        $analyze = $this->connection->prepare('EXPLAIN (ANALYZE)  '.$this->getSQL())->executeQuery($this->getParameters())->fetchAllAssociativeIndexed();
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


}