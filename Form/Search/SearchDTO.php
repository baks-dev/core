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

namespace BaksDev\Core\Form\Search;

use Symfony\Component\HttpFoundation\Request;

class SearchDTO
{
    public ?string $session = null;

    /**
     * Строка поиска
     */
    public string|int|null $query = null;

    private ?Request $request;

    public function __construct(?Request $request = null)
    {
        if($request)
        {
            $route = $request->attributes->get('_route');
            $this->session = substr($route, 0, strpos($route, ':'));
        }

        $this->request = $request;
    }

    public function isUid(): bool
    {
        return preg_match('{^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$}Di', $this->query);
    }

    /**
     * Query
     */
    public function getQuery(): ?string
    {
//        if($this->request)
//        {
//            $session = $this->request->getSession();
//
//            if($session->get('statusCode') === 307)
//            {
//                $this->request->getSession()->remove($this->session);
//            }
//
//            if(time() - $session->getMetadataBag()->getLastUsed() > 30)
//            {
//                $session->remove($this->session);
//            }
//
//            if(!$this->query)
//            {
//                $this->query = $session->get($this->session);
//            }
//        }

        return $this->query ? mb_strtolower(trim($this->query)) : null;
    }

    /**
     * Метод фильтрует строку поиска заменяя на пробел все, кроме
     * \p{L} - любой букве
     * \p{N} - любой цифре
     * \s - пробел
     */
    public function getQueryFilter()
    {
        return preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $this->getQuery());
    }

    public function setQuery(string|int|null $query): void
    {
//        if($this->request && empty($query))
//        {
//            $this->request->getSession()->remove($this->session);
//        }

        $this->query = $query;
    }

}
