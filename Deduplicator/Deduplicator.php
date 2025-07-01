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

namespace BaksDev\Core\Deduplicator;

use BaksDev\Core\Cache\AppCacheInterface;
use DateInterval;
use DateTimeImmutable;
use InvalidArgumentException;
use Symfony\Component\Cache\CacheItem;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\Cache\CacheInterface;

final class Deduplicator implements DeduplicatorInterface
{
    private string|false $namespace = false;

    private CacheItem $item;

    private CacheInterface|false $cache = false;

    private DateInterval $expires;

    private string|false $key = false;

    private bool $executed = false;

    public function __construct(
        #[Autowire(env: 'APP_ENV')] $environment,
        private readonly AppCacheInterface $appCache,
    )
    {
        /* Время жизни дедубликации по умолчанию 30 дней */
        $this->expires = DateInterval::createFromDateString($environment === 'prod' ? '1 week' : '3 seconds');
    }

    /**
     * Метод присваивает (переопределяет) время жизни дедубликатора (по умолчанию 1 неделя)
     */
    public function expiresAfter(DateInterval|string $time): self
    {
        if($time instanceof DateInterval)
        {
            $this->expires = $time;
            return $this;
        }

        $this->expires = DateInterval::createFromDateString($time);

        return $this;
    }

    /**
     * Метод присваивает пространство имен для дедубликации
     */
    public function namespace(string $namespace): self
    {
        $this->namespace = $this->namespace ?: $namespace;
        $this->cache = $this->cache ?: $this->appCache->init('deduplicator-'.$this->namespace);

        return $this;
    }

    /**
     * Метод присваивает ключ(и) для проверки дедубликации
     */
    public function deduplication(string|array $keys): self
    {
        /* Если не присвоено пространство имен - присваиваем из стека вызовов */
        if(false === $this->namespace)
        {
            $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2);
            $classes = array_column($backtrace, 'class');
            $this->namespace(md5(var_export($classes, true)));
        }

        $inst = clone $this;

        /* получаем из кеша результат */
        $inst->key = md5(var_export($keys, true));
        $inst->item = $this->cache->getItem($inst->key);

        return $inst;
    }

    /**
     * Метод делает проверку и возвращает результат выполненного ранее процесса
     */
    public function isExecuted(): bool
    {
        if($this->cache === false)
        {
            throw new InvalidArgumentException('Invalid Argument: call method deduplication or namespace');
        }

        /** @var CacheItem $item */
        $item = $this->cache->getItem($this->key);

        return true === $item->isHit() && false === empty($item->get());
    }

    /**
     * Метод сохраняет результат выполнения
     */
    public function save(): void
    {
        if($this->cache === false)
        {
            throw new InvalidArgumentException('Invalid Argument: call method deduplication or namespace');
        }

        $item = $this->cache
            ->getItem($this->key)
            ->expiresAfter($this->expires)
            ->set(time());

        $this->cache->save($item);
    }

    /**
     * Метод удаляет результат выполненного процесса
     */
    public function delete(): bool
    {
        if($this->cache === false)
        {
            throw new InvalidArgumentException('Invalid Argument: call method deduplication or namespace');
        }

        return $this->cache->deleteItem($this->getKey());
    }

    /**
     * Метод возвращает идентификатор ключа дедубликатора
     */
    public function getKey(): string
    {
        if(false === $this->key)
        {
            throw new InvalidArgumentException('Invalid Argument cache key');
        }

        return $this->key;
    }


    /**
     * Метод возвращает и сохраняет метку времени, по истечении которого можно выполнить следующий запрос
     * к новой метке добавляет время кеширования expires, тем самым позволит добавить в очередь сообщения, с разбросом
     *
     * @param DateInterval|string $delay - время в секундах, на которое необходимо отложить запрос
     */
    public function getAndSaveNextTime(DateInterval|string $delay = '1 seconds'): DateInterval|false
    {
        if($this->cache === false || $this->key === false)
        {
            return false;
        }

        if(false === ($delay instanceof DateInterval))
        {
            $delay = DateInterval::createFromDateString($delay);
        }

        $timestamp = time();

        /** @var CacheItem $item */
        $item = $this->cache->getItem($this->key);

        /** Присваиваем предыдущую метку времени */
        if($item->isHit())
        {
            $timestamp = $item->get();
            $timestamp = is_int($timestamp) ? $timestamp : time();
        }

        /** Определяем время следующей метки */
        $next = new DateTimeImmutable()
            ->setTimestamp($timestamp)
            ->add($delay);

        $diff = ($next->getTimestamp() - time());

        $this->expires = DateInterval::createFromDateString($diff.' seconds');


        /**
         * Сохраняем новую метку времени и время кеширования
         */
        $item
            ->expiresAfter($this->expires)
            ->set($next->getTimestamp());

        $this->cache->save($item);

        return $this->expires;
    }
}
