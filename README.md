# BaksDev Core

[![Version](https://img.shields.io/badge/version-7.1.94-blue)](https://github.com/baks-dev/core/releases)
![php 8.3+](https://img.shields.io/badge/php-min%208.3-red.svg)

Модуль Core

## Установка

``` bash
$ composer require baks-dev/core
```

## Настройка

Рекомендуется в composer.json проекта добавить в секцию автоматическое выполнение комманд

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

В корне проекта файла environment (.env) указать настройки основного домена

``` dotenv
###> HOST ###
HOST=domain.exemple
```

Для преобразования файлов изображений в формат WEBP устанавливаем
модуль [Files Cdn](https://github.com/baks-dev/files-cdn)

## Тестирование

``` bash
$ php bin/phpunit --group=core
```

## Лицензия ![License](https://img.shields.io/badge/MIT-green)

The MIT License (MIT). Обратитесь к [Файлу лицензии](LICENSE.md) за дополнительной информацией.

