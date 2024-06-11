# BaksDev Core

[![Version](https://img.shields.io/badge/version-7.1.10-blue)](https://github.com/baks-dev/core/releases)
![php 8.3+](https://img.shields.io/badge/php-min%208.3-red.svg)

Модуль Core

## Установка

``` bash
$ composer require baks-dev/core
```

## Натсройка

В корне проекта файла environment (.env) указать натсроки основного домена

``` dotenv
###> HOST ###
HOST=domain.exemple
```

Для преобразования файлов изобращений в формат WEBP устанавливаем модуль [Files Cdn](https://github.com/baks-dev/files-cdn)


## Тестирование

``` bash
$ php bin/phpunit --group=core
```

## Лицензия ![License](https://img.shields.io/badge/MIT-green)

The MIT License (MIT). Обратитесь к [Файлу лицензии](LICENSE.md) за дополнительной информацией.

