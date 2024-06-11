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

namespace BaksDev\Core\Lock;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Lock\LockFactory;
use Symfony\Component\Lock\SharedLockInterface;
use Symfony\Component\Lock\Store\FlockStore;

final class AppLock implements AppLockInterface
{
    private string $project_dir;

    private SharedLockInterface $lock;

    private float $ttl;

    public function __construct(
        #[Autowire('%kernel.project_dir%')] string $project_dir,
    )
    {
        $this->project_dir = $project_dir;
    }

    /**
     * Метод включает блокировку ресурса
     */
    public function createLock(string $key, int|float $defaultLifetime = 60.0): self
    {
        $store = new FlockStore($this->project_dir.'/var/stores');
        $factory = new LockFactory($store);

        $this->lock = $factory
            ->createLock($key, (float) $defaultLifetime, false);

        $this->lock->acquire(true);

        return $this;
    }

    /**
     * Метод завершает блокировку
     */
    public function release(): void
    {
        $this->lock->release();
    }

    public function getType()
    {
        return 'file';
    }

    /** Ожидаем снятие блокировки для последующего выполнения */
    public function wait(): self
    {
        $this->lock->acquire(true);
        return $this;
    }

    public function lifetime(int|float $ttl = 60): self
    {
        $this->ttl = (float) $ttl;
        return $this;
    }

    public function isLock(): bool
    {
        if($this->lock->isAcquired())
        {
            return true;
        }

        $this->lock->acquire();

        return false;
    }
}