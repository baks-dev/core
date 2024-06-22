<?php
/*
 *  Copyright 2023.  Baks.dev <admin@baks.dev>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

namespace BaksDev\Core\Type\UidType;

use Attribute;
use Symfony\Component\DependencyInjection\Argument\ArgumentInterface;
use Symfony\Component\HttpKernel\Attribute\ValueResolver;

#[Attribute(Attribute::TARGET_PARAMETER)]
class ParamConverter extends ValueResolver implements ArgumentInterface
{
    public array $values;

    private ?string $key;

    public function __construct(
        string $resolver,
        string $key = null
    ) {
        parent::__construct($resolver);
        $this->key = $key;
    }

    public function getValues(): array
    {
        return $this->values;
    }

    public function setValues(array $values): void
    {
        $this->values = $values;
    }

    /**
     * Key.
     */
    public function getKey(): ?string
    {
        return $this->key;
    }

}
