<?php
/*
 *  Copyright 2024.  Baks.dev <admin@baks.dev>
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

namespace BaksDev\Core\Type\Locale;

use BaksDev\Core\Type\Locale\Locales\LocaleDisable;
use BaksDev\Core\Type\Locale\Locales\LocaleInterface;
use BaksDev\Core\Type\Locale\Locales\Ru;
use Doctrine\Common\Collections\ArrayCollection;

/** Локализация  */
final class Locale
{
    public const string TYPE = 'locale';

    public const string TEST = Ru::class;

    private LocaleInterface $locale;

    public function __construct(LocaleInterface|self|string $locale)
    {
        if(is_string($locale) && class_exists($locale))
        {
            $instance = new $locale();

            if($instance instanceof LocaleInterface)
            {
                $this->locale = $instance;
                return;
            }
        }

        if($locale instanceof LocaleInterface)
        {
            $this->locale = $locale;
            return;
        }

        if($locale instanceof self)
        {
            $this->locale = $locale->getLocal();
            return;
        }

        /** @var LocaleInterface $declare */
        foreach(self::getDeclared() as $declare)
        {
            $instance = new self($declare);

            if($instance->getLocalValue() === $locale)
            {
                $this->locale = new $declare();
                return;
            }
        }

        $this->locale = new LocaleDisable();
    }


    public function __toString(): string
    {
        return $this->locale->getValue();
    }

    public function getLocal(): LocaleInterface
    {
        return $this->locale;
    }

    public function getLocalValue(): string
    {
        return $this->locale->getValue();
    }


    public static function routes(): ?array
    {
        $routes = null;

        $default = false;

        /** @var self $case */
        foreach(self::cases() as $case)
        {
            if($case->getLocal() instanceof LocaleDisable)
            {
                continue;
            }

            $local = $case->getLocalValue();
            $routes[$local] = $default ? '/'.$local : '';
            $default = true;
        }

        return $routes ?: [Ru::LOCAL => ''];
    }


    public static function cases(): array
    {
        $case = [];

        foreach(self::getDeclared() as $key => $declared)
        {
            /** @var LocaleInterface $declared */
            $class = new $declared();

            if($class instanceof LocaleDisable)
            {
                continue;
            }

            $case[$class::sort().$key] = new self($class);
        }

        ksort($case);

        return $case;
    }


    public static function default(): self
    {
        $default = new self(Ru::class);

        foreach(self::cases() as $case)
        {
            if($case->getLocal() instanceof LocaleDisable)
            {
                continue;
            }

            $default = $case;
            break;
        }

        return $default;
    }

    /**
     * Метод возвращает региональность в формате в стандарте ISO 639-1
     * @example ru_RU
     */
    public function getLangCountry(): string
    {
        return mb_strtolower($this->locale->getValue()).'_'.mb_strtoupper($this->locale->getValue());
    }

    public static function getDeclared(): array
    {
        return array_filter(
            get_declared_classes(),
            static function ($className) {
                return in_array(LocaleInterface::class, class_implements($className), true);
            }
        );
    }

    public static function diffLocale(ArrayCollection|array $diffArray): array
    {
        $search = [];

        foreach($diffArray as $item)
        {
            $search[] = $item->getLocal();
        }

        /* Вычисляем расхождение массивов */
        return array_diff(self::cases(), $search);
    }


    public function equals(mixed $status): bool
    {
        $status = new self($status);

        if(empty($status->getLocalValue()))
        {
            return false;
        }

        return $this->getLocalValue() === $status->getLocalValue();
    }
}
