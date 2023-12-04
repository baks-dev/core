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

namespace BaksDev\Core\Type\UserAgent;

use BaksDev\Core\Type\UserAgent\Agent\Collection\UserAgentInterface;

final class UserAgent
{
    public const TYPE = 'user_agent';

    public const TEST = UserAgent::class;

    private UserAgentInterface $userAgent;

    public function __construct(self|string|UserAgentInterface $userAgent)
    {
        if($userAgent instanceof UserAgentInterface)
        {
            $this->userAgent = $userAgent;
            return;
        }

        if(is_string($userAgent) && class_exists($userAgent))
        {
            $this->userAgent = new $userAgent();
            return;
        }

        if($userAgent instanceof $this)
        {
            $this->userAgent = $userAgent->getUserAgent();
            return;
        }

        /** @var UserAgentInterface $userAgent */
        foreach(self::getDeclared() as $declare)
        {
            if($declare::equals($userAgent))
            {
                $this->userAgent = new $declare;
                return;
            }
        }
    }

    public function __toString(): string
    {
        return (string) $this->userAgent;
    }

    public function getUserAgent(): UserAgentInterface
    {
        return $this->userAgent;
    }

    public function getUserAgentValue(): string
    {
        return $this->userAgent->getValue();
    }

    public static function cases(): array
    {
        $case = null;

        foreach(self::getDeclared() as $declared)
        {
            /** @var UserAgentInterface $declared */
            $class = new $declared;
            $case[] = new self($class);
        }

        ksort($case);

        return $case;
    }

    public static function getDeclared(): array
    {
        return array_filter(
            get_declared_classes(),
            static function($className) {
                return in_array(UserAgentInterface::class, class_implements($className), true);
            }
        );
    }

    public function equals(mixed $userAgent): bool
    {
        $userAgent = new self($userAgent);

        return $this->getUserAgentValue() === $userAgent->getUserAgentValue();
    }
}