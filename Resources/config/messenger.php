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
use BaksDev\Core\Messenger\MessageHandleMiddleware;
use DirectoryIterator;
use Symfony\Config\FrameworkConfig;

return static function(FrameworkConfig $framework) {

    $messenger = $framework->messenger();

    $messenger
        ->bus('messenger.bus.default')
        ->middleware(MessageHandleMiddleware::class);


    $messenger
        ->transport('failed')
        ->dsn('%env(MESSENGER_TRANSPORT_DSN)%')
        ->options(['table_name' => 'messenger_failed', 'queue_name' => 'failed']);


    $messenger
        ->transport('sync')->dsn('sync://');

    $messenger
        ->transport('async')
        ->dsn('%env(MESSENGER_TRANSPORT_DSN)%')
        ->options(['auto_setup' => true, 'queue_name' => 'async'])
        ->failureTransport('failed')
        ->retryStrategy()
        ->maxRetries(5)
        ->delay(1000)
        ->maxDelay(0)
        ->multiplier(2)
        ->jitter(0.1)
        ->service(null);

    $messenger
        ->transport('async-low')
        ->dsn('%env(MESSENGER_TRANSPORT_DSN)%')
        ->options(['queue_name' => 'async'])
        ->failureTransport('failed')
        ->retryStrategy()
        ->maxRetries(1)
        ->delay(1000)
        ->maxDelay(0)
        ->multiplier(2)
        ->jitter(0.1)
        ->service(null);


    /** SYSTEMD  */

    $messenger
        ->transport('systemd')
        ->dsn('%env(MESSENGER_TRANSPORT_DSN)%')
        ->options(['queue_name' => 'systemd'])
        ->failureTransport('failed')
        ->retryStrategy()
        ->maxRetries(5)
        ->delay(1000)
        ->maxDelay(0)
        ->multiplier(2)
        ->jitter(0.1)
        ->service(null);

    /**
     * Создаем список транспортов модулей
     */

    $BAKS = str_replace('core/', '', BaksDevCoreBundle::PATH);

    /** @var DirectoryIterator $module */
    foreach(new DirectoryIterator($BAKS) as $module)
    {
        if($module->isDot() || !$module->isDir() || $module->getBasename() === 'core')
        {
            continue;
        }

        $table_name = 'messenger_'.str_replace('-', '_', $module->getBasename());

        $messenger
            ->transport($module->getBasename())
            ->dsn('%env(MESSENGER_TRANSPORT_DSN)%')
            ->options(['table_name' => $table_name, 'auto_setup' => true, 'queue_name' => 'high'])
            ->failureTransport($module->getBasename().'-failed')
            ->retryStrategy()
            ->maxRetries(5)
            ->delay(1000)
            ->maxDelay(0)
            ->multiplier(2)
            ->jitter(0.1)
            ->service(null);

        $messenger
            ->transport($module->getBasename().'-low')
            ->dsn('%env(MESSENGER_TRANSPORT_DSN)%')
            ->options(['table_name' => $table_name, 'auto_setup' => true, 'queue_name' => 'low'])
            ->failureTransport($module->getBasename().'-failed')
            ->retryStrategy()
            ->maxRetries(5)
            ->delay(1000)
            ->maxDelay(0)
            ->multiplier(2)
            ->jitter(0.1)
            ->service(null);

        $messenger
            ->transport($module->getBasename().'-failed')
            ->dsn('%env(MESSENGER_TRANSPORT_DSN)%')
            ->options(['table_name' => 'messenger_failed', 'queue_name' => $module->getBasename()]);
    }
};
