# BaksDev Core

[![Version](https://img.shields.io/badge/version-7.3.38-blue)](https://github.com/baks-dev/core/releases)
![php 8.4+](https://img.shields.io/badge/php-min%208.4-red.svg)
[![packagist](https://img.shields.io/badge/packagist-green)](https://packagist.org/packages/baks-dev/core)

Модуль Core

## Установка

``` bash
$ composer require baks-dev/core
```

## Настройка

#### - .env

В корне проекта файла environment (.env) указать настройки основного домена

``` dotenv
###> HOST ###
HOST=domain.example
```

#### - systemd

В директори vendor/baks-dev/core/Resources/systemd находятся примеры сервисов (воркеров) messenger:consume,
контролируемых systemd. Название должно в себе содержать название модуля.

Пример допустимых названий на примере модуля «Core»:

``` text
core@.service
domain.example-core@.service
baks-core@.service
baks-domain.example-core@.service
```

В рамках одного сервера и нескольких проектов, в названии файла конфигурации сервиса ОБЯЗАТЕЛЬНО должен присутствовать
домен!

#### - composer.json

Рекомендуется в composer.json проекта добавить в секцию автоматическое выполнение из интерфейса командной строки

``` json
"scripts": {
    "auto-scripts": {
        "baks:assets:install": "symfony-cmd",
        "baks:cache:clear": "symfony-cmd"
    },
    "post-install-cmd": [
        "@auto-scripts"
    ],
    "post-update-cmd": [
        "@auto-scripts"
    ]
}
```


Для преобразования файлов изображений в формат WEBP устанавливаем
модуль [Files Cdn](https://github.com/baks-dev/files-cdn)

## Тестирование

``` bash
$ php bin/phpunit --group=core
```

## Лицензия ![License](https://img.shields.io/badge/MIT-green)

The MIT License (MIT). Обратитесь к [Файлу лицензии](LICENSE.md) за дополнительной информацией.
