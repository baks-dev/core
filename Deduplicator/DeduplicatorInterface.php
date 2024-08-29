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

namespace BaksDev\Core\Deduplicator;

use DateInterval;

interface DeduplicatorInterface
{
    /** Метод присваивает (переопределяет) время жизни дедубликатора (по умолчанию 1 неделя) */
    public function expiresAfter(DateInterval $time): void;

    /** Метод присваивает пространство имен для дедубликации */
    public function namespace(string $namespace): self;

    /** Метод присваивает ключ(и) для проверки дедубликации
     *
     *<code>
     *  $Deduplicator = $this->deduplicator
     *      ->namespace('module-name')
     *      ->deduplication([$key1, $key2]);
     *
     *  if($Deduplicator->isExecuted())
     *  {
     *      return;
     *  }
     *
     *  $Deduplicator->save();
     * </code>
     */
    public function deduplication(string|array $keys): self;

    /** Метод снимает лок с процесса  */
    public function unlock(): void;

    /** Метод делает проверку и возвращает результат выполненного ранее процесса */
    public function isExecuted(): bool;

    /** Метод сохраняет результат выполнения */
    public function save(): void;

    /** Метод удаляет результат выполненного процесса */
    public function delete(): bool;
}
