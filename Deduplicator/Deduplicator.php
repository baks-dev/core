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
use InvalidArgumentException;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
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
        $this->expires = DateInterval::createFromDateString($environment === 'prod' ? '30 days' : '1 seconds');
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
        $this->namespace = $namespace;

        // TODO: временно смотрим дедубликатор на файлах
        // $this->cache = $this->appCache->init('deduplicator-'.$this->namespace);
        $this->cache = new FilesystemAdapter($namespace, 86400, 'var/deduplicator');

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

        if(false === $this->executed)
        {
            $this->executed = $this->item->isHit() && trim($this->item->get()) === 'executed';
        }

        return $this->executed;


        //return $this->item->isHit() && trim($this->item->get()) === 'executed';
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

        /* Сохраняем ключ дедубликации */
        $this->item->set('executed');
        $this->item->expiresAfter($this->expires);
        $this->executed = $this->cache->save($this->item);
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

        $delete = $this->cache->deleteItem($this->getKey());
        $this->executed = !$delete;

        return $delete;
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
}
