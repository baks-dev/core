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
    private SharedLockInterface $lock;
    private LockFactory $factory;

    private string $key;
    private float $ttl = 60;
    private bool $release = true;
    private string $project_dir;


    public function __construct(
        #[Autowire('%kernel.project_dir%')] string $project_dir,
    ) {
        $this->project_dir = $project_dir;
    }

    /**
     * Метод включает блокировку ресурса
     */
    public function createLock(string|array $key): self
    {
        if(is_array($key))
        {
            $key = implode('', $key);
        }

        $this->key = $key;

        $FlockStore = new FlockStore($this->project_dir.'/var/stores');
        $this->factory = new LockFactory($FlockStore);

        return $this;
    }


    /**
     * Устанавливает время жизни блокировки
     */
    public function lifetime(int|float $ttl = 60): self
    {
        $this->ttl = (float) $ttl;
        return $this;
    }

    /**
     * Метод создает блокировку ресурса, параллельные запросы будут ожидать завершения блокировки
     *
     * <code>
     * $lock = $appLock
     *  ->createLock('example-key')
     *  ->lifetime(30)
     *  ->wait(); // выполняем последовательно запросы
     *
     * // выполняем код
     *
     * $lock->release(); // снимаем блокировку
     *
     * </code>
     *
     */
    public function wait(): self
    {
        $this->lock = $this->factory->createLock(
            $this->key,
            $this->ttl
        );

        $this->lock->acquire(true);

        return $this;
    }


    /**
     * Метод применяет блокировку процесса, без последующего автоматического снятия (ожидает все время)
     */
    public function waitAllTime(): self
    {
        $this->lock = $this->factory->createLock(
            $this->key,
            $this->ttl,
            false
        );

        $this->lock->acquire(true);

        return $this;
    }

    /**
     * Метод возвращает результат блокировки процесса
     *
     * false - Если ресурс не заблокирован (блокируем для других процессов и продолжаем выполнение)
     * true - Если ресурс занят другом процессом (завершаем выполнение программы)
     *
     * <code>
     *
     * $lock = $appLock
     *  ->createLock('example-key')
     *  ->lifetime(30);
     *
     * if($lock->isLock())
     * {
     *      return 'Невозможно выполнить запрос: процесс заблокирован';
     * }
     *
     * </code>
     *
     */
    public function isLock(): bool
    {

        $this->lock = $this->factory->createLock(
            $this->key,
            $this->ttl,
            false
        );

        $this->lock->acquire();

        if($this->lock->isAcquired())
        {
            return false;
        }

        return true;
    }


    /**
     * Метод завершает блокировку
     */
    public function release(): void
    {
        if($this->release)
        {
            $this->lock->release();
        }
    }


    public function getTypeLock(): string
    {
        return 'redis';
    }
}
