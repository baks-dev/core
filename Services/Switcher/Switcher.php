<?php
/*
 * Copyright (c) 2022.  Baks.dev <admin@baks.dev>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

namespace BaksDev\Core\Services\Switcher;

//use function mb_strtolower;
//use function strtr;

use function mb_strtolower;
use function strtr;

final class Switcher implements SwitcherInterface
{
    private string $text;

    private bool $lower;


    public function toRus(int|string $text, bool $lower = true): string
    {
        $this->text = (string) $text;
        $this->lower = $lower;

        return is_int($text) ? $this->text : $this->switch('ru');
    }


    public function toEng(int|string $text, bool $lower = true): string
    {
        $this->text = (string) $text;
        $this->lower = $lower;

        return is_int($text) ? $this->text : $this->switch('en');
    }

    public function toNumber(int|string $text, bool $lower = true): string
    {
        $this->text = (string) $text;
        $this->lower = $lower;

        return is_int($text) ? $this->text : $this->switch('en');
    }


    public function number()
    {

        $alphabet = ['а' => 1,
    'б' => 2,
    'в' => 3,
    'г' => 4,
    'д' => 5,
    'е' => 6,
    'ё' => 7,
    'ж' => 8,
    'з' => 9,
    'и' => 10,
    'й' => 11,
    'к' => 12,
    'л' => 13,
    'м' => 14,
    'н' => 15,
    'о' => 16,
    'п' => 17,
    'р' => 18,
    'с' => 19,
    'т' => 20,
    'у' => 21,
    'ф' => 22,
    'х' => 23,
    'ц' => 24,
    'ч' => 25,
    'ш' => 26,
    'щ' => 27,
    'ъ' => 28,
    'ы' => 29,
    'ь' => 30,
    'э' => 31,
    'ю' => 32,
    'я' => 33,
    'a' => 34,
    'b' => 35,
    'c' => 36,
    'd' => 37,
    'e' => 38,
    'f' => 39,
    'g' => 40,
    'h' => 41,
    'i' => 42,
    'j' => 43,
    'k' => 44,
    'l' => 45,
    'm' => 46,
    'n' => 47,
    'o' => 48,
    'p' => 49,
    'q' => 50,
    'r' => 51,
    's' => 52,
    't' => 53,
    'u' => 54,
    'v' => 55,
    'w' => 56,
    'x' => 57,
    'y' => 58,
    'z' => 59];



    }



    protected function switch(string $lng): string
    {
        $str['en'] = [
            'й' => 'q',
            'ц' => 'w',
            'у' => 'e',
            'к' => 'r',
            'е' => 't',
            'н' => 'y',
            'г' => 'u',
            'ш' => 'i',
            'щ' => 'o',
            'з' => 'p',
            'х' => '[',
            'ъ' => ']',
            'ф' => 'a',
            'ы' => 's',
            'в' => 'd',
            'а' => 'f',
            'п' => 'g',
            'р' => 'h',
            'о' => 'j',
            'л' => 'k',
            'д' => 'l',
            'ж' => ';',
            'э' => '\'',
            'я' => 'z',
            'ч' => 'x',
            'с' => 'c',
            'м' => 'v',
            'и' => 'b',
            'т' => 'n',
            'ь' => 'm',
            'б' => ',',
            'ю' => '.',
            'Й' => 'Q',
            'Ц' => 'W',
            'У' => 'E',
            'К' => 'R',
            'Е' => 'T',
            'Н' => 'Y',
            'Г' => 'U',
            'Ш' => 'I',
            'Щ' => 'O',
            'З' => 'P',
            'Х' => '[',
            'Ъ' => ']',
            'Ф' => 'A',
            'Ы' => 'S',
            'В' => 'D',
            'А' => 'F',
            'П' => 'G',
            'Р' => 'H',
            'О' => 'J',
            'Л' => 'K',
            'Д' => 'L',
            'Ж' => ';',
            'Э' => '\'',
            '?' => 'Z',
            'Ч' => 'X',
            'С' => 'C',
            'М' => 'V',
            'И' => 'B',
            'Т' => 'N',
            'Ь' => 'M',
            'Б' => ',',
            'Ю' => '.',
        ];

        $str['ru'] = [
            'q' => 'й',
            'w' => 'ц',
            'e' => 'у',
            'r' => 'к',
            't' => 'е',
            'y' => 'н',
            'u' => 'г',
            'i' => 'ш',
            'o' => 'щ',
            'p' => 'з',
            '[' => 'х',
            ']' => 'ъ',
            'a' => 'ф',
            's' => 'ы',
            'd' => 'в',
            'f' => 'а',
            'g' => 'п',
            'h' => 'р',
            'j' => 'о',
            'k' => 'л',
            'l' => 'д',
            ';' => 'ж',
            '\'' => 'э',
            'z' => 'я',
            'x' => 'ч',
            'c' => 'с',
            'v' => 'м',
            'b' => 'и',
            'n' => 'т',
            'm' => 'ь',
            ',' => 'б',
            '.' => 'ю',
            'Q' => 'Й',
            'W' => 'Ц',
            'E' => 'У',
            'R' => 'К',
            'T' => 'Е',
            'Y' => 'Н',
            'U' => 'Г',
            'I' => 'Ш',
            'O' => 'Щ',
            'P' => 'З',
            'A' => 'Ф',
            'S' => 'Ы',
            'D' => 'В',
            'F' => 'А',
            'G' => 'П',
            'H' => 'Р',
            'J' => 'О',
            'K' => 'Л',
            'L' => 'Д',
            'Z' => '?',
            'X' => 'ч',
            'C' => 'С',
            'V' => 'М',
            'B' => 'И',
            'N' => 'Т',
            'M' => 'Ь',
        ];

        $reload = strtr($this->text, $str[$lng]);

        return $this->lower ? mb_strtolower($reload) : $reload;
    }


    public function transliterate(string $string): string
    {
        $alphabet = [
            'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd', 'е' => 'e', 'ё' => 'e', 'ж' => 'zh', 'з' => 'z', 'и' => 'i',
            'й' => 'y', 'к' => 'k', 'л' => 'l', 'м' => 'm', 'н' => 'n', 'о' => 'o', 'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't',
            'у' => 'u', 'ф' => 'f', 'х' => 'h', 'ц' => 'c', 'ч' => 'ch', 'ш' => 'sh', 'щ' => 'shch', 'ъ' => '', 'ы' => 'y', 'ь' => '',
            'э' => 'e', 'ю' => 'yu', 'я' => 'ya',
            'А' => 'A', 'Б' => 'B', 'В' => 'V', 'Г' => 'G', 'Д' => 'D', 'Е' => 'E', 'Ё' => 'E', 'Ж' => 'Zh', 'З' => 'Z', 'И' => 'I',
            'Й' => 'Y', 'К' => 'K', 'Л' => 'L', 'М' => 'M', 'Н' => 'N', 'О' => 'O', 'П' => 'P', 'Р' => 'R', 'С' => 'S', 'Т' => 'T',
            'У' => 'U', 'Ф' => 'F', 'Х' => 'H', 'Ц' => 'C', 'Ч' => 'Ch', 'Ш' => 'Sh', 'Щ' => 'Shch', 'Ъ' => '', 'Ы' => 'Y', 'Ь' => '',
            'Э' => 'E', 'Ю' => 'Yu', 'Я' => 'Ya',
        ];

        return strtr($string, $alphabet);
    }


    /** Определяет, является ли первый символ русского алфавита */
    public function isRus($string) : bool
    {
        $first = mb_substr($string, 0, 1, 'UTF-8');

        if(preg_match('/[А-Яа-я]/u', $first))
        {
            return true;
        }

        return false;
    }

    /** Определяет, является ли первый символ латинского алфавита */
    public function isEng($string): bool
    {
        $first = mb_substr($string, 0, 1, 'UTF-8');

        if(preg_match('/[A-Za-z]/', $first))
        {
            return true;
        }

        return false;
    }
}