let yamapsLang = {
    'ru': {
        errorCity: 'Город не найдена. Возможно, вы имели в виду ', // ex: 1 accept numbers 0-6;
    },
    'en': {
        errorCity: 'Not found City. Perhaps you meant ', // ex: 1 accept numbers 0-6;
    }
}

//$htmlLang = document.getElementsByTagName('html');
//let $lang = $htmlLang[0].getAttribute('lang');


/*https://github.com/Kolyaj/CrossJS/blob/master/source/lang/Function.js#L26  */
/*(function (Function_prototype) {
    Function_prototype.debounce = function (delay, ctx) {
        var fn = this, timer;
        return function () {
            var args = arguments, that = this;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(ctx || that, args);
            }, delay);
        };
    };

})(Function.prototype);*/



function getSelectedOption(sel) {
    var opt;
    for (var i = 0, len = sel.options.length; i < len; i++) {
        opt = sel.options[i];
        if (opt.selected === true) {
            break;
        }
    }
    return opt;
}

function readGeoMaps($idCity, $idCityHelp) {

    /* Определяем поле ввода города */
    let $profileCity = document.getElementById($idCity);

    if (!$profileCity) {
        console.log('не найдено поле '+$idCity);
        return false;
    }

    function getCountry() {

        let $city = this.value;
        let $textCountry;
        if ($city.length > 2) {
            /* Определяем выбранный элемент Страны */
            //$country = document.getElementById($idCountry);
            $textCountry = 'Россия';

            /* Делаем запрос яндекс, и проверяем страну */
            var myGeocoder = ymaps.geocode($textCountry.text + "," + $city);

            myGeocoder.then(
                function (res) {
                    let $res = res.geoObjects.get(0).properties.getAll();
                    //console.log($res);

                    let $helpCountry = document.getElementById($idCityHelp);
                    $helpCountry.classList.remove('text-muted');

                    if ($res.name !== $city) {

                        $helpCountry.style.color = 'red';
                        $helpCountry.innerText = yamapsLang[$lang].errorCity + ' "' + $res.text + '"';
                    } else {
                        $helpCountry.style.color = 'green';
                        $helpCountry.innerText = $res.text
                    }

                    let span = document.createElement('SPAN');
                    span.className = 'text-primary cursor-pointer ps-3';
                    let span_text = document.createTextNode(' Применить');
                    span.append(span_text);

                    $helpCountry.appendChild(span);

                    span.addEventListener('click', function (event) {
                        $profileCity.value = $res.text;
                        $helpCountry.innerText = '';
                    });


                    // Выведем в консоль данные, полученные в результате геокодирования объекта.
                    /* console.log('Все данные геообъекта: ', res.geoObjects.get(0).properties.getAll()); */
                },
                function (err) {
                    // Обработка ошибки.
                }
            );
        }
    }

    //$profileCity.addEventListener('input', getCountry.debounce(500));

}


/*document.addEventListener('DOMContentLoaded', function () {

ymaps.ready(init);

function init() {

// Осуществляет поиск объекта с именем "Москва".
// Полученный результат сразу отображается на карте.
    var myGeocoder = ymaps.geocode("Беларусь, Калинковичи");
    myGeocoder.then(
        function (res) {
            // Выведем в консоль данные, полученные в результате геокодирования объекта.
            console.log('Все данные геообъекта: ', res.geoObjects.get(0).properties.getAll());
        },
        function (err) {
            // Обработка ошибки.
        }
    );

}
});*/