<?php
/*
 *  Copyright 2024.  Baks.dev <admin@baks.dev>
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

use App\Kernel;
use BaksDev\Core\Cache\AppCacheInterface;
use BaksDev\Core\Lock\AppLockInterface;
use DateInterval;
use InvalidArgumentException;
use Symfony\Component\Cache\CacheItem;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\Cache\CacheInterface;

final class Deduplicator implements DeduplicatorInterface
{
    private bool $init = false;

    private ?string $namespace = null;

    private AppLockInterface $lock;

    private CacheItem $item;

    private CacheInterface $cache;

    private DateInterval $expires;

    public function __construct(
        #[Autowire(env: 'APP_ENV')] private $environment,
        private readonly AppCacheInterface $appCache,
        private readonly AppLockInterface $appLock,
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
        /** Время жизни дедубликации в окружении кроме PROD - 1 seconds */
        if($this->environment !== 'prod')
        {
            $this->expires = DateInterval::createFromDateString('1 seconds');
            return $this;
        }

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
        return $this;
    }

    /**
     * Метод присваивает ключ(и) для проверки дедубликации
     */
    public function deduplication(string|array $keys): self
    {
        $key = var_export($keys, true);

        /* Если не присвоено пространство имен - присваиваем из стека вызовов */
        if($this->namespace === null)
        {
            $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2);
            $classes = array_column($backtrace, 'class');
            $this->namespace = md5(implode('', $classes));
        }

        /* блокируем одновременное выполнение скрипта (по умолчанию 1 мин) */
        $this->lock = $this->appLock->createLock($key);
        $this->lock->wait();

        /* получаем из кеша результат */
        $this->cache = $this->appCache->init('deduplicator-'.$this->namespace);
        $this->item = $this->cache->getItem(md5($key));

        $this->init = true;

        return $this;
    }

    /**
     * Метод снимает лок с процесса
     */
    public function unlock(): void
    {
        $this->lock->release();
    }

    /**
     * Метод делает проверку и возвращает результат выполненного ранее процесса
     */
    public function isExecuted(): bool
    {
        if($this->init === false)
        {
            throw new InvalidArgumentException('Invalid Argument: call method deduplication');
        }

        if($this->item->isHit() && trim($this->item->get()) === 'executed')
        {
            $this->lock->release();
            return true;
        }

        return false;
    }

    /**
     * Метод сохраняет результат выполнения
     */
    public function save(): void
    {
        if($this->init === false)
        {
            throw new InvalidArgumentException('Invalid Argument: call method deduplication');
        }

        /* Сохраняем ключ дедубликации */
        $this->item->set('executed');
        $this->item->expiresAfter($this->expires);
        $this->cache->save($this->item);

        usleep(500);

        /* Снимаем лок с процесса */
        $this->lock->release();
    }

    /**
     * Метод удаляет результат выполненного процесса
     */
    public function delete(): bool
    {
        if($this->init === false)
        {
            throw new InvalidArgumentException('Invalid Argument: call method deduplication');
        }

        return $this->cache->deleteItem($this->item->getKey());
    }

    /**
     * Метод возвращает идентификатор ключа дедубликатора
     */
    public function getKey(): string
    {
        return $this->item->getKey();
    }
}
