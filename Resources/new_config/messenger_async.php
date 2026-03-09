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

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Symfony\Config\DoctrineConfig;
use Symfony\Config\FrameworkConfig;

$isDoctrine = str_starts_with($_ENV['MESSENGER_DATABASE_URL'], 'doctrine');


$retry_strategy = [
    'max_retries' => 5,
    'delay' => 1000,
    'multiplier' => 2,
    'max_delay' => 0,
    'jitter' => 0.1,
    'service' => null,
];


/**
 * ASYNC TRANSPORT
 */

$options = match (true)
{
    $isDoctrine => [
        'table_name' => 'messenger_core',
        'auto_setup' => true,
        'queue_name' => 'async',
    ],

    default => []
};

$transports['async'] = [
    'dsn' => env('MESSENGER_TRANSPORT_DSN'),
    'options' => $options,
    'retry_strategy' => $retry_strategy,
    'failure_transport' => 'failed',
];


/**
 * ASYNC LOW TRANSPORT
 */

$options = match (true)
{
    $isDoctrine => [
        'table_name' => 'messenger_core',
        'auto_setup' => true,
        'queue_name' => 'async-low',
    ],

    default => []
};

$transports['async-low'] = [
    'dsn' => env('MESSENGER_TRANSPORT_DSN'),
    'options' => $options,
    'retry_strategy' => $retry_strategy,
    'failure_transport' => 'failed',
];


return App::config([
    'framework' => [
        'messenger' => [
            'transports' => $transports,
        ],
    ],
]);