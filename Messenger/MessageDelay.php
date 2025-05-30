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

namespace BaksDev\Core\Messenger;

use DateInterval;
use Random\Randomizer;
use Symfony\Component\Messenger\Stamp\DelayStamp;

final class MessageDelay
{
    private DateInterval $interval;

    /**
     *
     * По умолчанию отложенное сообщение на 2 секунды
     *
     * Пример использования:
     *
     * - объект: new DateInterval('3 seconds')
     * - строка: '3 seconds' ('minutes', 'hours')
     * - число в секундах: 3
     */
    public function __construct(DateInterval|string|int $interval = 2)
    {
        if($interval instanceof DateInterval)
        {
            $this->interval = $interval;
            return;
        }

        if(is_string($interval))
        {
            $this->interval = DateInterval::createFromDateString($interval);
            return;
        }


        $this->interval = DateInterval::createFromDateString($interval.' seconds');

    }

    public function getMilliseconds(): int
    {
        $totalSeconds =
            ($this->interval->d * 86400) + // дни в секундах
            ($this->interval->h * 3600) +  // часы в секундах
            ($this->interval->i * 60) +    // минуты в секундах
            $this->interval->s;            // секунды

        /**
         * Задержка в миллисекундах отложенного сообщения не может быть больше одних суток
         */
        if(empty($totalSeconds) || $totalSeconds > 86400)
        {
            $totalSeconds = 86400;
        }

        return $totalSeconds * 1000;
    }

    public function getDelayStamp(): DelayStamp
    {
        $milliseconds = $this->getMilliseconds();

        /** Генерируем рандомно число для разброса сообщений */
        $Randomizer = new Randomizer();
        $delay = $Randomizer->getInt($milliseconds, ($milliseconds * 2));

        return new DelayStamp($delay);
    }
}