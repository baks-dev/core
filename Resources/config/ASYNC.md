
#### Если вы измените файл конфигурации службы, вам необходимо перезагрузить демон:

``` bash

systemctl daemon-reload

```


####  Название файла в директории /etc/systemd/system

``` text

baks-async@.service

```


#### Содержимое файла

``` text
[Unit]
Description=Baks Scheduler %i
StartLimitBurst=5
StartLimitIntervalSec=0

[Service]
ExecStart=php /.......PATH_TO_PROJECT......../bin/console messenger:consume async --memory-limit=128m --time-limit=3600 --limit=100
Restart=always

[Install]
WantedBy=default.target

```


#### Команды для выполнения


``` bash

systemctl daemon-reload

systemctl enable baks-async@1.service
systemctl start baks-async@1.service
systemctl restart baks-async@1.service

systemctl disable baks-async@1.service
systemctl stop baks-async@1.service

```

#### Запуск из консоли на 1 минуту

``` bash

php bin/console messenger:consume async --time-limit=60 -vv

```
