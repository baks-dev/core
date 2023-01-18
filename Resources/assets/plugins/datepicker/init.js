
function initDatepick($id) {
    /* определяем язык то тегу HTML и атрибуту lang*/
    // $htmlLang = document.getElementsByTagName('html');
    // let $lang = $htmlLang[0].getAttribute('lang');

    /* делаем отложенную загрузку Datepicker */
    setTimeout(function () {
        const DatePicker = MCDatepicker.create({
            el: '#'+$id,
            bodyType: 'modal', // ‘modal’, ‘inline’, or ‘permanent’.
            autoClose: false,
            closeOndblclick: true,
            closeOnBlur: false,
            customOkBTN: 'OK',
            customClearBTN: datapickerLang[$lang].customClearBTN,
            customCancelBTN: datapickerLang[$lang].customCancelBTN,
            firstWeekday: datapickerLang[$lang].firstWeekday,
            dateFormat: 'DD.MM.YYYY',
            customWeekDays: datapickerLang[$lang].customWeekDays,
            customMonths: datapickerLang[$lang].customMonths
        });
    }, 500);
}