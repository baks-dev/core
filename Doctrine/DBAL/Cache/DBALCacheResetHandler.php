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

declare(strict_types=1);

namespace BaksDev\Core\Doctrine\DBAL\Cache;


use BaksDev\Core\Cache\AppCacheInterface;
use BaksDev\Core\Deduplicator\DeduplicatorInterface;
use BaksDev\Core\Doctrine\DBALQueryBuilder;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Target;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Stopwatch\Stopwatch;

#[AsMessageHandler(priority: 0)]
final readonly class DBALCacheResetHandler
{
    public function __construct(
        #[Target('coreLogger')] private LoggerInterface $logger,
        private AppCacheInterface $appCache,
        private DeduplicatorInterface $deduplicator,
        private DBALQueryBuilder $DBALQueryBuilder,
    ) {}

    /** Обновляет кеш запроса */
    public function __invoke(DBALCacheResetMessage $message): void
    {

        /** Получаем обновляемые данные */

        $cache = $this->appCache->init($message->getNamespace());
        $cacheItem = $cache->getItem($message->getKey());
        $cacheUpdate = $cacheItem->get();

        if($cacheItem->isHit() === false)
        {
            return;
        }

        $isUpdate = false;

        foreach($cacheUpdate as $key => $item)
        {

            /** Формируем данные выполняемого запроса */

            $requests = explode('&', $key);

            $result = null;

            foreach($requests as $request)
            {
                $parts = explode('=', $request, 2);

                if(count($parts) === 2)
                {
                    $partKey = trim(current($parts));
                    $partValue = trim(end($parts));

                    if($partKey === 'params' || $partKey === 'types')
                    {
                        $partValue = unserialize($partValue, ['allowed_classes' => true]);
                    }

                    $result[$partKey] = $partValue;
                }
            }

            if(is_null($result))
            {
                continue;
            }

            /** Получаем результат кеширования */

            $tmpCache = $this->DBALQueryBuilder
                ->createQueryBuilder(self::class)
                ->enableCache('tmp', refresh: false);

            $tmpCacheKey = $tmpCache->getCacheKey();

            /** Замеряем время выполнения запроса */

            $stopwatch = new Stopwatch();
            $stopwatch->start($tmpCacheKey);

            $tmpCache->executeCacheQuery($result['query'], $result['params'], $result['types']);

            $event = $stopwatch->stop($tmpCacheKey);
            $endTime = $event->getEndTime();

            /** Сохраняем в лог информацию о запросе и времени его выполнения */

            // Удаляем символы \t, \r, \n и заменяем двойные пробелы на одинарные
            $query = preg_replace("/[\t\r\n]+/", '', $result['query']);
            $query = preg_replace('/ +/', ' ', $query);
            $log = sprintf('%s: %s', $event->getEndTime(), $query);

            match (true)
            {
                // Допустимое время выполнения запроса
                $endTime < 1000 => $this->logger->debug($log, $result['params']),

                // Время выполнения запроса, на которое стоит обратить внимание
                $endTime < 5000 => $this->logger->notice($log, $result['params']),

                // Запрос, который требует внимание и анализа
                default => $this->logger->warning($log, $result['params']),
            };

            /** Обновляем массив результатом */

            $tmpCacheQueries = $tmpCache->getCacheQueries();
            $tmpCache = $tmpCacheQueries->getItem($tmpCacheKey)->get();

            if(is_array($tmpCache))
            {
                $isUpdate = true;
                $cacheUpdate[$key] = current($tmpCache);
            }

            $tmpCacheQueries->deleteItem($tmpCacheKey);

        }

        if($isUpdate)
        {
            $cacheItem->set($cacheUpdate);
            $cache->save($cacheItem);
        }

        $this->deduplicator
            ->namespace($message->getNamespace())
            ->deduplication([$message->getKey()])
            ->delete();

    }
}
