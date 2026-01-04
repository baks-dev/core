<?php
/*
 *  Copyright 2026.  Baks.dev <admin@baks.dev>
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

namespace BaksDev\Core\Form\Search;

class SearchDTO
{
    /**
     * Строка поиска
     */
    public string|int|null $query = null;

    private array $searchTags = [];

    public function getSearchTags(): array
    {
        return $this->searchTags;
    }

    public function setSearchTags(array $searchTags): self
    {
        $this->searchTags = $searchTags;
        return $this;
    }


    public function isUid(): bool
    {
        if(empty($this->query))
        {
            return false;
        }

        return preg_match('{^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$}Di', $this->query);
    }

    /**
     * Query
     */
    public function getQuery(): ?string
    {
        return $this->query ? mb_strtolower(trim($this->query)) : null;
    }

    /**
     * Метод фильтрует строку поиска заменяя на пробел все, кроме
     * \p{L} - любой букве
     * \p{N} - любой цифре
     * \s - пробел
     */
    public function getQueryFilter(): array|string|null
    {
        return preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $this->getQuery());
    }

    public function setQuery(string|int|null $query): self
    {
        $this->query = $query;
        return $this;
    }

}
