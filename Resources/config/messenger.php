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
use Symfony\Config\DoctrineConfig;
use Symfony\Config\FrameworkConfig;

return static function(FrameworkConfig $framework, DoctrineConfig $doctrine) {


    /**
     * Настройка подключения к базе данных с очередями
     */


    $transport = $_ENV['MESSENGER_TRANSPORT_DSN'];
    $isDoctrine = str_starts_with($transport, 'doctrine');


    if($isDoctrine)
    {
        if(str_contains($transport, '?'))
        {
            preg_match('/^doctrine:\/\/(.*?)\?/', $transport, $matches);
        }
        else
        {
            preg_match('/^doctrine:\/\/(.*?)(?|$)/', $transport, $matches);
        }


        /**
         * Если подключение не DEFAULT - указываем кастомное подключение
         */
        if(isset($matches[1]) && $matches[1] !== 'default')
        {
            $doctrine
                ->dbal()
                ->connection('messenger', ['url' => '%env(resolve:MESSENGER_DATABASE_URL)%']);
        }
    }


    $messenger = $framework->messenger();

    $messenger
        ->bus('messenger.bus.default')
        ->middleware(MessageHandleMiddleware::class);


    /**
     * FAILED TRANSPORT
     */


    $failedTransport = $messenger
        ->transport('failed')
        ->dsn('%env(MESSENGER_TRANSPORT_DSN)%');

    !$isDoctrine ?: $failedTransport->options([
        'table_name' => 'messenger_failed',
        'auto_setup' => true,
        'queue_name' => 'failed',
    ]);


    /**
     * SYNC TRANSPORT
     */


    $syncTransport = $messenger
        ->transport('sync')
        ->dsn('sync://');


    /**
     * ASYNC TRANSPORT
     */

    $syncTransport = $messenger
        ->transport('async')
        ->dsn('%env(MESSENGER_TRANSPORT_DSN)%');

    !$isDoctrine ?: $syncTransport->options([
        'table_name' => 'messenger_core',
        'auto_setup' => true,
        'queue_name' => 'async',
    ]);

    $syncTransport
        ->retryStrategy()
        ->maxRetries(5)
        ->delay(1000)
        ->maxDelay(0)
        ->multiplier(2)
        ->jitter(0.1)
        ->service(null);

    $syncTransport
        ->failureTransport('failed');


    /**
     * ASYNC LOW TRANSPORT
     */


    $asyncLowTransport = $messenger
        ->transport('async-low')
        ->dsn('%env(MESSENGER_TRANSPORT_DSN)%');

    !$isDoctrine ?: $asyncLowTransport->options([
        'table_name' => 'messenger_core',
        'auto_setup' => true,
        'queue_name' => 'low',
    ]);

    $asyncLowTransport
        ->retryStrategy()
        ->maxRetries(1)
        ->delay(1000)
        ->maxDelay(0)
        ->multiplier(2)
        ->jitter(0.1)
        ->service(null);

    $asyncLowTransport
        ->failureTransport('failed');


    /**
     * SYSTEMD TRANSPORT
     */


    $systemdTransport = $messenger
        ->transport('systemd')
        ->dsn('%env(MESSENGER_TRANSPORT_DSN)%');

    !$isDoctrine ?: $systemdTransport->options([
        'table_name' => 'messenger_core',
        'auto_setup' => true,
        'queue_name' => 'systemd',
    ]);

    $systemdTransport
        ->retryStrategy()
        ->maxRetries(5)
        ->delay(1000)
        ->maxDelay(0)
        ->multiplier(2)
        ->jitter(0.1)
        ->service(null);

    $systemdTransport
        ->failureTransport('failed');



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

        $table_name = 'messenger_'.str_replace('-', '_', $module->getBasename());


        /**
         * MODULE HIGH TRANSPORT
         */


        $moduleTransportHigh = $messenger
            ->transport($module->getBasename())
            ->dsn('%env(MESSENGER_TRANSPORT_DSN)%');

        !$isDoctrine ?: $moduleTransportHigh->options([
            'table_name' => $table_name,
            'auto_setup' => true,
            'queue_name' => 'high',
        ]);

        $moduleTransportHigh
            ->retryStrategy()
            ->maxRetries(5)
            ->delay(1000)
            ->maxDelay(0)
            ->multiplier(2)
            ->jitter(0.1)
            ->service(null);


        /**
         * MODULE LOW TRANSPORT
         */


        $moduleTransportLow = $messenger
            ->transport($module->getBasename().'-low')
            ->dsn('%env(MESSENGER_TRANSPORT_DSN)%');

        !$isDoctrine ?: $moduleTransportLow->options([
            'table_name' => $table_name,
            'auto_setup' => true,
            'queue_name' => 'low',
        ]);

        $moduleTransportLow
            ->retryStrategy()
            ->maxRetries(5)
            ->delay(1000)
            ->maxDelay(0)
            ->multiplier(2)
            ->jitter(0.1)
            ->service(null);


        /**
         * MODULE FAILED TRANSPORT
         */


        $moduleTransportFailed = $messenger
            ->transport($module->getBasename().'-failed')
            ->dsn('%env(MESSENGER_TRANSPORT_DSN)%');

        !$isDoctrine ?: $moduleTransportFailed->options([
            'table_name' => 'messenger_failed',
            'auto_setup' => true,
            'queue_name' => $module->getBasename(),
        ]);

        // High
        $moduleTransportHigh
            ->failureTransport($module->getBasename().'-failed');

        // Low
        $moduleTransportLow
            ->failureTransport($module->getBasename().'-failed');

    }

};
