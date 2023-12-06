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


use BaksDev\Core\Cache\AppCacheInterface;
use BaksDev\Core\Type\Locale\Locale;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query;
use Doctrine\ORM\QueryBuilder;
use Psr\Cache\CacheItemPoolInterface;
use Symfony\Component\Cache\Adapter\ApcuAdapter;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\Translation\TranslatorInterface;

final class ORMQueryBuilder extends QueryBuilder
{
    private CacheItemPoolInterface $cacheQueries;

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
        $newInstance = new self(
            $this->entityManager,
            $this->translator,
            $this->cache,
            $this->env
        );

        $newInstance->resetDQLParts();
        $newInstance->setParameters([]);

        //$this->isCache = false;
        $newInstance->cacheKey = str_replace('\\', '.', is_object($class) ? $class::class : $class);
        $newInstance->namespace = 'ORMCache';

        return $newInstance;
    }

    /**
     * Кешируем результат ORM
     */

    public function enableCache(string $namespace = null, int $ttl = 60)
    {
        $this->isCache = true;
        $this->ttl = $ttl + random_int(0, $ttl); // разбрасываем время кеша

        if($namespace)
        {
            $this->namespace = $namespace;
        }


        $this->cacheQueries = $this->cache->init($this->namespace, $ttl);

        $this->query = $this->getEntityManager()->createQuery($this->getDQL());

        $this->cacheKey .= '.'.implode('.', array_map(function($value) {
                return is_array($value->getValue()) ?
                    json_encode($value->getValue(), JSON_THROW_ON_ERROR) :
                    $value->getValue();
            }, $this->getParameters()->toArray()));




        /** Сохраняем метку времени в APCU */
        $DatetimeCache = new ApcuAdapter();

        $lastDatetimeCache = $DatetimeCache->getItem('date.'.$this->cacheKey);
        $lastDatetime = $lastDatetimeCache->get();

        if($lastDatetime === null || time() > $lastDatetime)
        {
            /* Перезаписываем метку времени запроса */
            $lastDatetimeCache->set(time() + 10);
            $lastDatetimeCache->expiresAfter($this->ttl);
            $DatetimeCache->save($lastDatetimeCache);

            if(time() > $lastDatetime)
            {
                /* Сбрасываем кеш для последующего запроса */
                register_shutdown_function([$this, 'resetCacheQuery'], 'throw');
            }
        }





        $this->query
            ->setQueryCache($this->cacheQueries)
            ->setResultCache($this->cacheQueries)
            ->enableResultCache($this->ttl, $this->cacheKey) // 60 - 1 минута
            ->setParameters($this->getParameters());

        if($this->getMaxResults())
        {
            $this->query->setMaxResults($this->getMaxResults());
        }


        return $this;
    }

    /**
     * Возвращает ровно один результат или ноль.
     */
    public function getOneOrNullResult(): ?object
    {
        if($this->isCache)
        {
            $this->methodResult = 'getOneOrNullResult';
            return $this->query->getOneOrNullResult() ?: null;
        }

        return $this->getQuery()->getOneOrNullResult() ?: null;
    }


    /**
     * Возвращает массив сущностей.
     */
    public function getResult(): ?array
    {
        if($this->isCache)
        {
            $this->methodResult = 'getResult';
            return $this->query->getResult();
        }

        return $this->getQuery()->getResult() ?: null;
    }

    public function flush(): void
    {
        $this->entityManager->flush();
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

    public function clear() : self
    {
        $this->entityManager->clear();
        return $this;
    }
}