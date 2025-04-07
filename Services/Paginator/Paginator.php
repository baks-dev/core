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

namespace BaksDev\Core\Services\Paginator;

use BaksDev\Core\Doctrine\DBALQueryBuilder;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

final class Paginator implements PaginatorInterface
{
    public const array LIMIT_ARRAY = [1, 24, 50, 100, 200, 500];

    private const int LIMIT = 24;

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
    private int $limit = 24;

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

        if($this->session)
        {
            if($this->request->query->getInt('limit'))
            {
                $this->session->set(
                    $this->namespace.':limit',
                    min($this->request->query->getInt('limit'), 500) // ограничение 500
                );
            }

            $this->limit = $this->session->get($this->namespace.':limit') ?: self::LIMIT;
        }


        $this->id = $this->request->attributes->get('id') ?: $this->request->get('id');

        $this->page = $this->request->attributes->get('page') ?: $this->request->get('page') ?: 0;
        $this->next = $this->page + 1;
        $previous = $this->page - 1;
        $this->previous = $previous < 0 ? null : $previous;

    }

    public function fetchAllHydrate(DBALQueryBuilder $qb, string $class, ?string $namespace = null): self
    {
        $namespace = $namespace ?: $this->namespace;

        if($qb->getMaxResults())
        {
            $this->limit = $qb->getMaxResults();
        }
        else
        {
            $qb->setMaxResults($this->limit);
        }

        $qb->setFirstResult($this->page * $this->limit);

        if($namespace)
        {
            $qb->enableCache($namespace);
        }

        if(($this->request && $this->session?->get('statusCode') === 307))
        {
            /** Сбрасываем кеш ключа запроса */
            $qb->resetCacheQuery();
            $this->request->getSession()->remove('statusCode');
        }

        $this->data = iterator_to_array($qb->fetchAllHydrate($class));

        /** По умолчанию COUNTER присваиваем равным количеству возвращаемых элементов  */
        $this->counter = count($this->data);

        /** Включаем пагинацию, если количество возвращаемых элементов больше либо равно лимиту */
        $this->pagination = $this->counter >= $this->limit;

        /** Если количество больше лимита - считаем количество  */
        if($this->pagination)
        {
            $counter = $qb->count(true);
            $this->counter = is_null($counter) ? 'более '.$this->limit : $counter;

            if($this->request && $this->session?->get('statusCode') === 307)
            {
                /** Сбрасываем кеш COUNTER */
                $qb->deleteCacheQueries();
            }
        }

        return $this;
    }


    public function fetchAllAssociative(DBALQueryBuilder $qb, ?string $namespace = null): self
    {
        $namespace = $namespace ?: $this->namespace;

        if($qb->getMaxResults())
        {
            $this->limit = $qb->getMaxResults();
        }
        else
        {
            $qb->setMaxResults($this->limit);
        }

        $qb->setFirstResult($this->page * $this->limit);

        if($namespace)
        {
            $qb->enableCache($namespace);
        }

        if(($this->request && $this->session?->get('statusCode') === 307))
        {
            /** Сбрасываем кеш ключа запроса */
            $qb->resetCacheQuery();
            $this->request->getSession()->remove('statusCode');
        }

        $this->data = $qb->fetchAllAssociative();

        /** По умолчанию COUNTER присваиваем равным количеству возвращаемых элементов  */
        $this->counter = count($this->data);

        /** Включаем пагинацию, если количество возвращаемых элементов больше либо равно лимиту */
        $this->pagination = $this->counter >= $this->limit;

        /** Если количество больше лимита - считаем количество  */
        if($this->pagination)
        {
            $counter = $qb->count(true);
            $this->counter = is_null($counter) ? 'более '.$this->limit : $counter;

            if($this->request && $this->session?->get('statusCode') === 307)
            {
                /** Сбрасываем кеш COUNTER */
                $qb->deleteCacheQueries();
            }
        }

        return $this;
    }


    public function fetchAllAssociativeIndexed(DBALQueryBuilder $qb, ?string $namespace = null): self
    {
        $namespace = $namespace ?: $this->namespace;

        if(($this->request && $this->session->get('statusCode') === 307) || $this->request->query->getInt('limit'))
        {
            /** Сбрасываем кеш ключа запроса */
            //$qb->resetCacheQuery();
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

        if($namespace)
        {
            $qb->enableCache($namespace);
        }

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
