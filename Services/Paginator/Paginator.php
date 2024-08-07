<?php
/*
 * Copyright (c) 2022.  Baks.dev <admin@baks.dev>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

namespace BaksDev\Core\Services\Paginator;

use BaksDev\Core\Doctrine\DBALQueryBuilder;
use BaksDev\Core\Type\Locale\Locales\Ru;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

final class Paginator implements PaginatorInterface
{
    public const LIMIT_ARRAY = [1, 24, 50, 100, 200, 500];

    private const LIMIT = 24;

    private ?Request $request;

    private ?SessionInterface $session = null;

    private int $page;

    private int $next;

    /** Номер предыдущей страницы */
    private ?int $previous = null;

    /**
     * Флаг имеется ли в результате пагинация
     */
    private bool $pagination;

    /**
     * Лимит результатов запроса
     */
    private int $limit;

    /**
     * Идентификатор, переданный атрибутом или параметром GET
     */
    private mixed $id;

    private array $data = [];

    private string $path;

    private ?string $counter = null;

    private string $namespace;


    public function __construct(RequestStack $request)
    {
        $this->request = $request->getCurrentRequest() ?: new Request();

        $this->path = $this->request->get('_route') ?: 'core';
        $this->namespace = substr($this->path, 0, strpos($this->path, ':'));


        $this->session = $this->request->hasPreviousSession() ? $this->request->getSession() : null;


        /** Получаем limit */

        if($this->request->query->getInt('limit'))
        {
            $this->session?->set($this->namespace.':limit', $this->request->query->getInt('limit'));
        }

        $this->limit = $this->session?->get($this->namespace.':limit') ?: 0;

        if(!$this->limit)
        {
            $this->limit = self::LIMIT;
            $this->session?->set($this->namespace.':limit', self::LIMIT);
        }

        $this->id = $this->request->attributes->get('id') ?: $this->request->get('id');

        $this->page = $this->request->attributes->get('page') ?: $this->request->get('page') ?: 0;
        $this->next = $this->page + 1;
        $previous = $this->page - 1;
        $this->previous = $previous < 0 ? null : $previous;

    }

    public function fetchAllAssociative(DBALQueryBuilder $qb, string $namespace = null): self
    {
        $namespace = $namespace ?: $this->namespace;

        if($namespace)
        {
            $qb->enableCache($namespace, 3600);
        }

        if($this->request && $this->session?->get('statusCode') === 307)
        {
            /** Сбрасываем кеш ключа запроса */
            $qb->deleteCacheQueries();
            $qb->disableResultCache();
            $qb->resetCacheQuery();
        }

        if($qb->getMaxResults())
        {
            $this->limit = $qb->getMaxResults();
        }
        else
        {
            $qb->setMaxResults($this->limit);
        }

        $qb->setFirstResult($this->page * $this->limit);


        $this->data = $qb->fetchAllAssociative();

        $this->pagination = count($this->data) >= $this->limit;

        /** Если количество больше лимита - считаем количество  */
        if($this->pagination)
        {
            $cacheKey = 'counter.'.$qb->getCacheKey();

            if($this->session?->get('statusCode') === 307)
            {
                /** Сбрасываем кеш ключа запроса */
                $qb->select('COUNT(*)');
                $qb->setMaxResults(null);

                $qb->resetGroupBy();
                $qb->resetOrderBy();

                $this->counter = $qb->fetchOne();
            }
            else
            {
                if($qb->getCacheQueries()?->hasItem($cacheKey))
                {

                    $this->counter = ($qb->getCacheQueries()->getItem($cacheKey))->get();
                }
                else
                {
                    $this->counter = 'более '.$this->limit;
                }
            }

            $qb->resetCacheCounter();
        }
        else
        {
            $this->counter = count($this->data);
        }


        if($this->request && $this->session?->get('statusCode') === 307)
        {
            /** Сбрасываем кеш ключа запроса */
            $this->session?->remove('statusCode');
        }

        return $this;
    }

    public function fetchAllAssociativeIndexed(DBALQueryBuilder $qb, string $namespace = null): self
    {
        $namespace = $namespace ?: $this->namespace;

        if($namespace)
        {
            $qb->enableCache($namespace, 3600);
        }

        if($this->request && $this->session->get('statusCode') === 307)
        {
            /** Сбрасываем кеш ключа запроса */
            $qb->deleteCacheQueries();
            $this->request->getSession()->remove('statusCode');

            $qb->disableResultCache();
        }

        if($qb->getMaxResults())
        {
            $this->limit = $qb->getMaxResults();
        }
        else
        {
            $qb->setMaxResults($this->limit);
        }

        $qb->setFirstResult($this->page * $this->limit);


        $this->data = $qb->fetchAllAssociativeIndexed();
        $this->pagination = count($this->data) >= $this->limit;

        return $this;
    }


    /** Возвращает массив данных, полученных в результате запроса в БД */
    public function getData(): array
    {
        return $this->data;
    }

    /** Возвращает переданное значение лимита */
    public function getLimit(): int
    {
        return $this->limit;
    }

    /** Возвращает переданное значение лимита */
    public function setLimit(int $limit): self
    {
        $this->limit = $limit;
        return $this;
    }


    /** Возвращает дефолтное значение LIMIT */
    public function getDefaultLimit(): int
    {
        return self::LIMIT;
    }

    /** Возвращает номер текущей страницы  */
    public function getPage(): int
    {
        return $this->page + 1;
    }

    /**
     * Возвращает номер следующей страницы относительно текущей
     */
    public function getNext(): int
    {
        return $this->next;
    }

    /**
     * Возвращает номер предыдущей страницы относительно текущей
     */
    public function getPrevious(): ?int
    {
        return $this->previous;
    }

    public function getPagination(): bool
    {
        return $this->pagination;
    }

    public function getPath(): string
    {
        return $this->path;
    }

    /**
     * Возвращает массив доступных лимитов (для select в пагинации)
     */
    public function getOptions(): array
    {
        return self::LIMIT_ARRAY;
    }

    /**
     * Возвращает идентификатор, переданный атрибутом или параметром GET
     */
    public function getId(): mixed
    {
        return $this->id;
    }

    /**
     * Counter
     */
    public function getCounter(): ?string
    {
        return $this->counter;
    }
}
