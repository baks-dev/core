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

namespace BaksDev\Core\Lock;

use Symfony\Component\Lock\SharedLockInterface;

interface AppLockInterface
{
    /**
     * Инициируем блокировку процесса
     */
    public function createLock(string|array $keys): self;

    /**
     * Устанавливает время жизни блокировки
     */
    public function lifetime(int|float $ttl = 60): self;

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
    public function wait(): self;

    /**
     * Метод применяет блокировку процесса, без последующего автоматического снятия (ожидает все время)
     */
    public function waitAllTime(): self;


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
    public function isLock(): bool;

    /**
     * Метод снимает блокировку с ресурса после выполнения
     */
    public function release(): void;

}
