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
use BaksDev\Core\Type\Locale\Locale;
use DateInterval;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\Table;
use Doctrine\ORM\Query;
use Doctrine\ORM\QueryBuilder;
use Psr\Cache\CacheItemPoolInterface;
use Random\Randomizer;
use ReflectionAttribute;
use ReflectionClass;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

final class ORMQueryBuilder extends QueryBuilder
{
    private CacheInterface|CacheItemPoolInterface $cacheQueries;

    private bool $isCache = false;

    private string $cacheKey;

    private int $ttl;

    private string $methodResult = 'getResult';

    private Query $query;

    private TranslatorInterface $translator;

    private string|array|object $namespace;
    private EntityManagerInterface $entityManager;
    private string $env;
    private AppCacheInterface $cache;

    public function __construct(
        EntityManagerInterface $entityManager,
        TranslatorInterface $translator,
        AppCacheInterface $cache,
        #[Autowire(env: 'APP_ENV')] string $env = 'test',
    )
    {
        $this->entityManager = $entityManager;
        $this->translator = $translator;
        $this->env = $env;
        $this->cache = $cache;

        parent::__construct($entityManager);

    }

    public function createQueryBuilder(object|string $class): self
    {
        $this->entityManager->clear();

        $newInstance = new self(
            $this->entityManager,
            $this->translator,
            $this->cache,
            $this->env
        );

        $newInstance->resetDQLParts();
        $newInstance->setParameters(new ArrayCollection());

        $this->isCache = false;
        $newInstance->cacheKey = str_replace('\\', '.', is_object($class) ? $class::class : $class);
        $newInstance->namespace = 'ORMCache';

        return $newInstance;
    }

    /**
     * Кешируем результат ORM
     */

    public function enableCache(?string $namespace = null, int|string $ttl = 60)
    {
        if($namespace)
        {
            $this->namespace = $namespace;
        }

        $this->isCache = true;
        $this->ttl = $this->getTimeToLive($ttl);
        $this->cacheKey .= '.'.md5(var_export($this->getParameters()->toArray(), true));
        $this->cacheQueries = $this->cache->init($this->namespace, $this->ttl);

        return $this;
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

        return new Randomizer()->getInt($seconds, ($seconds * 2));
    }

    /**
     * Возвращает ровно один результат или null.
     */
    public function getOneOrNullResult(): ?object
    {
        if($this->isCache)
        {
            return $this->cacheQueries->get($this->cacheKey, function(ItemInterface $item): ?object {

                $item->expiresAfter(DateInterval::createFromDateString('1 seconds'));

                $result = $this
                    ->getQuery()
                    ->getOneOrNullResult() ?: null;

                if($result)
                {
                    $item->expiresAfter($this->ttl);
                }

                return $result;
            });
        }

        return $this
            ->getQuery()
            ->getOneOrNullResult() ?: null;
    }


    /**
     * Возвращает массив сущностей.
     */
    public function getResult(): ?array
    {
        if($this->isCache)
        {
            return $this->cacheQueries->get($this->cacheKey, function(ItemInterface $item): ?array {

                $item->expiresAfter(DateInterval::createFromDateString('1 seconds'));

                $result = $this
                    ->getQuery()
                    ->getResult() ?: null;

                if($result)
                {
                    $item->expiresAfter($this->ttl);
                }

                return $result;
            });
        }

        return $this->getQuery()->getResult() ?: null;
    }

    public function flush(): void
    {
        $this->entityManager->flush();
        $this->entityManager->clear();
    }

    /**
     * Перезаписываем кеш
     */
    private function resetCacheQuery(): void
    {
        /* Не сбрасываем кеш если тестовая среда */
        if($this->env === 'test')
        {
            return;
        }

        $this->cacheQueries->delete($this->cacheKey);

        $this->query
            ->setQueryCache($this->cacheQueries)
            ->setResultCache($this->cacheQueries)
            ->enableResultCache($this->ttl, $this->cacheKey)
            ->setParameters($this->getParameters())
            ->{$this->methodResult}();


        $lastDatetime = $this->cacheQueries->getItem('date.'.$this->cacheKey);
        $lastDatetime->set(60 + time());
        $lastDatetime->expiresAfter($this->ttl);
        $this->cacheQueries->save($lastDatetime);
    }

    /**
     * Метод создает параметр для запроса согласно локали Local
     */
    public function bindLocal(): self
    {
        $this->setParameter('local', new Locale($this->translator->getLocale()), Locale::TYPE);
        return $this;
    }

    public function clear(): self
    {
        $this->entityManager->clear();
        return $this;
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