<?php
/*
 *  Copyright 2023.  Baks.dev <admin@baks.dev>
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

namespace BaksDev\Core\Cache;

use Symfony\Component\Cache\Adapter\ApcuAdapter;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Component\Cache\Marshaller\MarshallerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

final class AppCache implements AppCacheInterface
{
    private string $type = FilesystemAdapter::class;

    private string $HOST;

    public function __construct(
        #[Autowire(env: 'HOST')] string $HOST,
    )
    {
        $this->HOST = $HOST;
    }

    public function init(
        string $namespace = null,
        int $defaultLifetime = 0,
        MarshallerInterface $marshaller = null
    ): FilesystemAdapter
    {
        $namespace = $namespace ? $this->HOST.'.'.$namespace : $this->HOST;

        $cache = (function_exists('apcu_enabled') && apcu_enabled()) ? ApcuAdapter::class : FilesystemAdapter::class;

        // (string $namespace = '', int $defaultLifetime = 0, string $version = null, MarshallerInterface $marshaller = null)
        // (string $namespace = '', int $defaultLifetime = 0, string $directory = null, MarshallerInterface $marshaller = null)

        return new $cache ($namespace, 0, marshaller: $marshaller);
    }

    public function getCacheType(): string
    {
        return $this->type;
    }
}