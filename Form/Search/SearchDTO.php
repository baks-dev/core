<?php
/*
 * Copyright (c) 2022.  Baks.dev <admin@baks.dev>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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

    public function __construct(Request $request = null)
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
        if($this->request)
        {
            $session = $this->request->getSession();

            if($session->get('statusCode') === 302)
            {
                $this->request->getSession()->remove($this->session);
            }

            if(time() - $session->getMetadataBag()->getLastUsed() > 5)
            {
                $session->remove($this->session);
            }

            if(!$this->query)
            {
                $this->query = $session->get($this->session);
            }
        }

        return $this->query ? mb_strtolower(trim($this->query)) : null;
    }

    public function setQuery(string|int|null $query): void
    {
        if($this->request && empty($query))
        {
            $this->request->getSession()->remove($this->session);
        }

        $this->query = $query;
    }

}