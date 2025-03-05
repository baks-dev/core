<?php
/*
 *  Copyright 2025.  Baks.dev <admin@baks.dev>
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

use BaksDev\Core\BaksDevCoreBundle;
use DirectoryIterator;
use Symfony\Config\FrameworkConfig;

return static function(FrameworkConfig $framework) {

    $messenger = $framework->messenger();

    $messenger->transport('sync')->dsn('sync://');

    /** ASYNC */
    // redis://%s@%s:%s?dbindex=%s
    // ?auto_setup=true&serializer=1&stream_max_entries=0&dbindex=0

    $messenger
        ->transport('async')
        ->dsn('redis://%env(REDIS_PASSWORD)%@%env(REDIS_HOST)%:%env(REDIS_PORT)%?dbindex=%env(REDIS_TABLE)%&auto_setup=true')
        ->options(['stream' => 'async'])
        ->failureTransport('failed')
        ->retryStrategy()
        ->maxRetries(3)
        ->delay(1000)
        ->maxDelay(0)
        ->multiplier(3)
        ->service(null);

    $messenger
        ->transport('async-low')
        ->dsn('%env(MESSENGER_TRANSPORT_DSN)%')
        ->options(['queue_name' => 'async'])
        ->failureTransport('failed')
        ->retryStrategy()
        ->maxRetries(1)
        ->delay(1000)
        ->maxDelay(1)
        ->multiplier(2)
        ->service(null);

    $failure = $framework->messenger();

    $failure->transport('failed')
        ->dsn('%env(MESSENGER_TRANSPORT_DSN)%')
        ->options(['queue_name' => 'failed']);


    /** SYSTEMD  */

    $systemd = $framework->messenger();

    $systemd
        ->transport('systemd')
        ->dsn('redis://%env(REDIS_PASSWORD)%@%env(REDIS_HOST)%:%env(REDIS_PORT)%?dbindex=%env(REDIS_TABLE)%&auto_setup=true')
        ->options(['stream' => 'systemd'])
        ->failureTransport('failed-systemd')
        ->retryStrategy()
        ->maxRetries(3)
        ->delay(1000)
        ->maxDelay(0)
        ->multiplier(3) // увеличиваем задержку перед каждой повторной попыткой
        ->service(null);

    $failure->transport('failed-systemd')
        ->dsn('%env(MESSENGER_TRANSPORT_DSN)%')
        ->options(['queue_name' => 'failed-systemd']);

    /**
     * Создаем список транспортов модулей
     */

    $BAKS = str_replace('core/', '', BaksDevCoreBundle::PATH);

    /** @var DirectoryIterator $module */
    foreach(new DirectoryIterator($BAKS) as $module)
    {
        if($module->isDot() || !$module->isDir())
        {
            continue;
        }

        $messenger
            ->transport($module)
            ->dsn('%env(MESSENGER_TRANSPORT_DSN)%&table_name=messenger-'.$module)
            ->options(['queue_name' => 'high'])
            ->failureTransport($module.'-failed')
            ->retryStrategy()
            ->maxRetries(3)
            ->delay(1000)
            ->maxDelay(1)
            ->multiplier(3)
            ->service(null);

        $messenger
            ->transport($module.'-low')
            ->dsn('%env(MESSENGER_TRANSPORT_DSN)%&table_name=messenger-'.$module)
            ->options(['queue_name' => 'low'])
            ->failureTransport($module.'-failed')
            ->retryStrategy()
            ->maxRetries(3)
            ->delay(1000)
            ->maxDelay(1)
            ->multiplier(3)
            ->service(null);

        $messenger
            ->transport($module.'-failed')
            ->dsn('%env(MESSENGER_TRANSPORT_DSN)%&table_name=messenger-orders-order')
            ->options(['queue_name' => 'failed']);

    }
};
