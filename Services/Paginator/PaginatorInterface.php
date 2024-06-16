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

namespace BaksDev\Core\Services\Paginator;

use BaksDev\Core\Doctrine\DBALQueryBuilder;

interface PaginatorInterface
{
    public function fetchAllAssociativeIndexed(DBALQueryBuilder $qb, string $namespace = null): self;


    public function fetchAllAssociative(DBALQueryBuilder $qb, string $namespace = null): self;


    public function getData(): array;


    public function getLimit(): int;


    public function getDefaultLimit(): int;


    public function getPage(): int;


    public function getNext(): int;


    public function getPrevious(): ?int;


    public function getPagination(): bool;


    public function getPath(): string;


    public function getOptions(): array;


    public function getId(): mixed;

}