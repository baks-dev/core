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


final class Switcher implements SwitcherInterface
{
    private string $text;
    private bool $lower;

    public function toRus(string $text, bool $lower = true) : string
    {
        $this->text = $text;
        $this->lower = $lower;
        
        return $this->switch('ru');
    }
    
    public function toEng(string $text, bool $lower = true) : string
    {
        $this->text = $text;
        $this->lower = $lower;
        
        return $this->switch('en');
    }
    
    protected function switch(string $lng) : string
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
          '[' => 'Х',
          ']' => 'Ъ',
          'A' => 'Ф',
          'S' => 'Ы',
          'D' => 'В',
          'F' => 'А',
          'G' => 'П',
          'H' => 'Р',
          'J' => 'О',
          'K' => 'Л',
          'L' => 'Д',
          ';' => 'Ж',
          '\'' => 'Э',
          'Z' => '?',
          'X' => 'ч',
          'C' => 'С',
          'V' => 'М',
          'B' => 'И',
          'N' => 'Т',
          'M' => 'Ь',
          ',' => 'Б',
          '.' => 'Ю',
        ];
        
        $reload = \strtr($this->text, $str[$lng]);
        
        return $this->lower ? \mb_strtolower($reload) :  $reload;
    }
}