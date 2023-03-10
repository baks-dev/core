let eventEmitter = new EventTarget();
let $html;

/* определяем язык системы по тегу HTML */
// $htmlLang = document.getElementsByTagName('html');
// const $lang = $htmlLang[0].getAttribute('lang');


//document.addEventListener("DOMContentLoaded", function (event) {

/* Прелоадер при отправке формы */
/*document.querySelectorAll('form').forEach(function (forms) {
    /!* событие отправки формы *!/
    forms.addEventListener('submit', function (event) {
        indicatorSubmit(this);
    });
});*/

/*function indicatorSubmit(context) {
    /!* показываем индикатор *!/
    let indicator = context.querySelector('.indicator-progress');

    if (indicator) {
        indicator.className = 'indicator-label progress';
        /!* Блокируем кнопку от повторной отправки *!/
        indicator.closest('button[type="submit"]').type = 'button';
    }
}*/


/*function indicatorReset() {
    /!* Сбрасываем индикатор *!/
    let indicator_progress = document.querySelector('.progress');

    if (indicator_progress) {
        indicator_progress.className = 'indicator-progress';
        /!* Снимаем блок с кнопки от повторной отправки *!/
        let btn = indicator_progress.closest('button[type="button"]');

        btn.type = 'submit';

        return btn;
    }
}*/


setTimeout(function initBootstrap() {

    /*console.log(bootstrap);*/

    if (bootstrap) {

        var carouselElList = [].slice.call(document.querySelectorAll('.carousel'));
        carouselElList.map(function (carouselEl) {
            return new bootstrap.Carousel(carouselEl);
        });

        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        var toastElList = [].slice.call(document.querySelectorAll('.toast'));
        toastElList.map(function (toastEl) {
            return new bootstrap.Toast(toastEl, {delay: 300000}).show();
        });

        //$('.carousel-inner').carousel({interval: 2000});

        var offcanvasElList = [].slice.call(document.querySelectorAll('.offcanvas'));
        offcanvasElList.map(function (offcanvaslEl) {
            return new bootstrap.Offcanvas(offcanvaslEl);
        });


        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))

        popoverTriggerList.map(function (popoverTriggerEl) {


            popoverTriggerEl.addEventListener('shown.bs.popover', function (event) {


                let describedby = this.getAttribute('aria-describedby');


                if (describedby) {

                    let elementDescribedby = document.getElementById(describedby);

                    document.addEventListener('click', HidePopover);

                    function HidePopover(e) {
                        const withinBoundaries = e.composedPath().includes(elementDescribedby);

                        if (!withinBoundaries) {
                            document.removeEventListener("click", HidePopover);
                            pops.toggle();
                        }
                    }

                    elementDescribedby.querySelectorAll('.modal-link').forEach(function (item, i, arr) {
                        /* Добавляем атрибуты модального окна */
                        item.dataset.bsTarget = '#modal';
                        item.dataset.bsToggle = 'modal';
                        modalLink(item);
                    });


                    elementDescribedby.querySelectorAll('.dropdown-toggle').forEach(function (item, i, arr) {
                        /* Добавляем атрибуты модального окна */
                        item.dataset.bsToggle = 'dropdown';
                        new bootstrap.Dropdown(item);
                    });


                    /* document.getElementById(describedby).querySelectorAll('.dropdown-toggle').forEach(function (item, i, arr) {
                         /!* Добавляем атрибуты модального окна *!/
                         console.log(465465465);

                         new bootstrap.Dropdown(item);
                     });*/


                    //const dropdownElementList = document.querySelectorAll('.dropdown-toggle')
                    //const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl))


                }
            })

            const pops = new bootstrap.Popover(popoverTriggerEl, {
                html: true,
                content: function () {
                    return document.getElementById(this.id + '-content').innerHTML;
                },

                title: function () {

                    let title = document.getElementById(this.id + '-title');
                    if (title) {
                        return document.getElementById(this.id + '-title').innerHTML;
                    }

                }
            });


            return pops;
        });


        // Enables popover
        /*$("#example-popover").popover({
            html : true,
            content: function() {
                return $("#example-popover-content").html();
            },
            title: function() {
                return $("#example-popover-title").html();
            }
        });*/


        return;
    }

    setTimeout(initBootstrap, 100);

}, 100);


/*setTimeout(function initBootstrap() {

    /!*console.log(bootstrap);*!/

    if (bootstrap) {
        return;
    }
    setTimeout(initBootstrap, 100);

}, 100);*/

function modaHidden() {
    /* Скрываем модальное окно */
    let ModalElement = document.getElementById('modal');
    bootstrap.Modal.getInstance(ModalElement).hide();
}


/*<button type="submit" id="add_material_stock_form_add" name="add_material_stock_form[add]" className="btn-warning btn">
    <span className="indicator-label">Сохранить</span>
    <span className="indicator-progress">
        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
    </span>
</button>*/

/* вешаем события на модальные ссылки */
document.querySelectorAll('.modal-link')
    .forEach(function (item, i, arr) {
        modalLink(item);
    });


/* Показываем все тосты */
// var toastElList = [].slice.call(document.querySelectorAll('.toast'));
// var toastList = toastElList.map(function (toastEl) {
//     if (bootstrap != undefined) {  new bootstrap.Toast(toastEl, {delay: 300000}).show(); }
// });

//});


function modalLink(item) {

    item.addEventListener('click', function (event) {


        /* Отключаем дефолтный переход по ссылке */
        event.preventDefault();


        /* Создаём объект класса XMLHttpRequest */
        const request = new XMLHttpRequest();

        /*  Получаем из ссылки адрес запроса */
        let url = null;

        if (this.href) {
            url = item.href;
        } else {
            url = item.dataset.href
        }

        if (!url) {
            return;
        }

        /* Указываем метод соединения GET и путь к файлу на сервере */
        request.open('GET', url);
        /* Указываем заголовки для сервера */
        request.setRequestHeader('Content-Type', 'application/x-www-form-url');
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');


        /* Получаем ответ от сервера на запрос*/
        request.addEventListener("readystatechange", function (evemnt) {
            /* request.readyState - возвращает текущее состояние объекта XHR(XMLHttpRequest) */
            if (request.readyState === 4 && request.status === 200) {

                const modal = document.getElementById('modal');

                modal.innerHTML = request.responseText;

                /* делаем глобальную отметку о завершении запроса */
                eventEmitter.dispatchEvent(new Event('complete'));

                /* Сбрасываем содержимое модального окна при закрытии */
                modal.addEventListener('hidden.bs.modal', function (event) {
                    this.innerHTML = '';
                })

                /* Если в модальном окне присутствует select2 */
                modal.querySelectorAll('[data-select="select2"]').forEach(function (item) {
                    new NiceSelect(item, {searchable: true});
                });

                modal.querySelectorAll('form').forEach(function (forms) {

                    /* событие отправки формы */
                    forms.addEventListener('submit', function (event) {
                        event.preventDefault();
                        submitModalForm(forms);
                        return false;
                    });
                });

                $html = request.responseText;
            } else {
                /* Закрываем модальное окно */
                //let myModalEl = document.querySelector('#modal')
                //let modal = bootstrap.Modal.getOrCreateInstance(myModalEl) // Returns a Bootstrap modal instance
                //modal.hide();
            }
        });

        /*Выполняем запрос*/
        request.send();

        return false;

        /*


            /!* создаем модальное окно *!/
            var $modal = document.getElementById('modal');

            /!* сбрасываем модальное окно при закрытии *!/
            $modal.addEventListener('hidden.bs.modal', function () {
                this.innerHTML = '';
            });

        */
    });
}


async function submitModalForm(forms) {

    const data = new FormData(forms);

    // /* показываем индикатор */
    let indicator = forms.querySelector('.spinner-border');

    if (indicator) {
        btn = indicator.closest('button');

        indicator.classList.remove('d-none');
        btn.disabled = true;
        btn.type = 'button';
    }

    await fetch(forms.action, {
        method: forms.method, // *GET, POST, PUT, DELETE, etc.
        //mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: data // body data type must match "Content-Type" header
    })

        .then((response) => {

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {

                throw new TypeError("Oops, we haven't got JSON!");
            }


            closeProgress();
            btn.type = 'submit';

            /* Закрываем модальное окно */
            let myModalEl = document.querySelector('#modal')
            let modal = bootstrap.Modal.getOrCreateInstance(myModalEl) // Returns a Bootstrap modal instance
            modal.hide();

            if (response.status === 302) {
                window.location.href = '/refresh';
                return;
            }

            return response.json();
        })

        .then((data) => {

            if (data === undefined) {
                return false;
            }

            if (data.status === 200 && data.redirect !== undefined) {
                window.location.href = data.redirect;
                return false;
            }

            createToast(data);
        });


    return false;


    // .catch((error) => {
    //     console.error('Error:', error);
    // }); // parses JSON response into native JavaScript objects
}


let checked_item = document.querySelectorAll('.checked-item');
let all_usecase = document.getElementById('all_usecase');

function checkedAll($this) {

    //console.log($this.dataset.id);


    all_usecase.classList.add('d-none');

    if ($this.checked) {
        all_usecase.classList.remove('d-none')
    }

    if ($this.dataset.id !== undefined) {
        document.querySelectorAll('.checked-item-all').forEach(function (item, i, arr) {
            item.checked = $this.dataset.id === item.dataset.id;
        });
    }

    checked_item.forEach(function (item, i, arr) {
        if ($this.dataset.id !== undefined) {
            if ($this.dataset.id !== item.dataset.id) {
                item.checked = false;
                return;
            }
        }

        item.checked = $this.checked;
        //console.log(item.dataset.id);
    });
}

function checkedItem(checkedItem = null) {

    all_usecase.classList.add('d-none');

    checked_item.forEach(function (item, i, arr) {
        if (item.checked) {
            all_usecase.classList.remove('d-none');
        }

        if (item.dataset.id !== undefined) {
            document.querySelectorAll('.checked-item-all').forEach(function (itemAll, i, arr) {
                if (itemAll.dataset.id !== item.dataset.id) {
                    itemAll.checked = false;
                }
            });
        }
    });

    if (checkedItem && checkedItem.dataset.id !== undefined) {
        document.querySelectorAll('.checked-item').forEach(function (itemOther, i, arr) {
            if (itemOther.dataset.id != checkedItem.dataset.id) {
                itemOther.checked = false;
            }
        });
    }
}


(function (Function_prototype) {
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

})(Function.prototype);


function backToTop() {


    const scrollingElement = (document.scrollingElement || document.body);

    window.scrollBy({
        top: (scrollingElement.scrollTop * -1),
        behavior: 'smooth'
    });

    return false;

    //document.body.scrollTop = 0;
    ///document.documentElement.scrollTop = 0;
}

function backToEnd() {

    const scrollingElement = (document.scrollingElement || document.body);
    window.scrollBy({
        top: scrollingElement.scrollHeight,
        behavior: 'smooth'
    });
}


function scrollFunction() {

    const scrollingElement = document.scrollingElement.scrollHeight;

    if (
        document.body.scrollTop > 60 ||
        document.documentElement.scrollTop > 60
    ) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }

    let clientHeight = (document.documentElement.clientHeight * 2) + document.documentElement.scrollTop;

    if (clientHeight > scrollingElement) {
        mybuttonEnd.style.display = "none";
    } else {
        mybuttonEnd.style.display = "block";
    }
}


//window.addEventListener('load', function () {


// let mybutton = document.getElementById("btn-back-to-top");
// let mybuttonEnd = document.getElementById("btn-back-to-end");

// Когда пользователь прокручивает вниз 20 пикселей от верха документа, показываем кнопку
// window.onscroll = function () {
//     scrollFunction();
// };

// /* Когда пользователь нажимает кнопку, прокручиваем до верхней части старницы. */
// mybutton.addEventListener("click", backToTop);
// mybuttonEnd.addEventListener("click", backToEnd);


//console.log(bootstrap);

/*var modal = new bootstrap.Modal('#typeForm');
document.addEventListener('closeModal', () => {
    modal.hide();
});*/

function createToast(data) {

    let $type = data.type;
    let $header = data.header;
    let $message = data.message;
    let $href = data.href;
    let $name = data.name;

    var toastDiv = document.getElementById('toast');

    if (toastDiv) {
        // class="alert alert-light" role="alert"
        var toastEl = document.createElement('div');
        toastEl.className = 'toast';
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');

        var tostHeader = document.createElement('div');
        tostHeader.className = 'toast-header';
        toastEl.append(tostHeader);

        /*var toastSpan = document.createElement('SPAN');
        toastSpan.classList.add('symbol');
        toastSpan.classList.add('symbol-circle');
        toastSpan.classList.add('toast-icon');
        if ($type) { toastSpan.classList.add('bg-' + $type); }
        toastSpan.classList.add('me-3');*/

        //tostHeader.append(toastSpan);

        /* Заголовок */
        var tostStrong = document.createElement('strong');
        tostStrong.classList.add('me-auto');
        tostStrong.classList.add('mt-1');
        tostStrong.textContent = $header;
        tostHeader.append(tostStrong);

        /* Кнопка закрыть */
        var tostClosed = document.createElement('button');
        tostClosed.type = 'button';
        tostClosed.className = 'btn-close';
        tostClosed.setAttribute('data-bs-dismiss', 'toast');
        tostClosed.setAttribute('aria-label', 'Close');
        tostHeader.append(tostClosed);


        /* Текст сообщения */
        var toastBody = document.createElement('div');
        toastBody.className = 'toast-body';
        toastEl.append(toastBody);

        var toastText = document.createElement('p');
        toastText.textContent = $message;
        toastBody.append(toastText);


        if ($href) {
            var toastHref = document.createElement('a');
            toastHref.classList.add('text-decoration-none');
            toastHref.classList.add('ms-3');
            toastHref.href = $href;
            toastHref.textContent = $name;
            toastText.append(toastHref);
        }

        document.getElementById('toast').appendChild(toastEl);
        //document.getElementById('toast').appendChild(toastEl);
        //document.getElementById('toast').appendChild(toastEl);

        //new bootstrap.Toast(toastEl, {delay: 3000000}).show();


        setTimeout(function showToast() {

            if (bootstrap) {
                new bootstrap.Toast(toastEl, {delay: 3000000}).show();
                return;
            }

            setTimeout(showToast, 500);

        }, 500);

    }
}

/* Прелоадер */
document.querySelectorAll('.spinner-border').forEach(function (indicator) {

    let btn = indicator.closest('.btn');
    if (btn) {
        btn.addEventListener('click', function () {
            indicator.classList.remove('d-none');
            this.disabled = true;

            /* Если спнер в форме - проверяем валидацию */
            let spinnerForm = this.closest('form')

            if (spinnerForm) {
                let frm = document.forms[spinnerForm.name];
                if (frm) {


                    Array.from(frm.elements).forEach((input) => {
                        let $errorFormHandler = false;

                        if (input.validity.valid === false) {
                            closeProgress();

                            /* Поиск полей по LABEL */
                            $label = document.querySelector('label[for="' + input.id + '"]');
                            let $labelText = $label ? $label.innerHTML : false;

                            if ($labelText) {

                                $errorFormHandler = '{ "type":"danger" , ' +
                                    '"header":"' + $labelText + '"  , ' +
                                    '"message" : "Ошибка заполнения" }';

                                if ($errorFormHandler !== false) {
                                    createToast(JSON.parse($errorFormHandler));
                                }

                                return false;
                            }


                            /* Поиск полей по Placeholder */
                            $placeholderInput = document.querySelector('#' + input.id + '');
                            $placeholder = $placeholderInput.getAttribute('placeholder');
                            let $placeholderText = $placeholder ? $placeholder : false;

                            if ($placeholderText) {
                                $errorFormHandler = '{ "type":"danger" , ' +
                                    '"header":"' + $placeholderText + '"  , ' +
                                    '"message" : "Ошибка заполнения" }';

                                if ($errorFormHandler !== false) {
                                    createToast(JSON.parse($errorFormHandler));
                                }

                                return false;
                            }

                            return false;
                        }

                    });


                }
            }
        });
    }
});


function closeProgress() {
    document.querySelectorAll('.spinner-border').forEach(function (indicator) {
        setTimeout(function () {
            indicator.classList.add('d-none');
            let btn = indicator.closest('.btn');
            if (btn) {
                btn.disabled = false;
            }
        }, 300);
    });
}


/*setTimeout(() => {

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    var toastElList = [].slice.call(document.querySelectorAll('.toast'));
    toastElList.map(function (toastEl) {
        return bootstrap.Toast(toastEl, {delay: 300000}).show();
    });

}, 3000);*/


let selectPagination = document.getElementById('select-pagination');
if (selectPagination) {
    selectPagination.addEventListener('change', function (event) {
        this.form.submit();
    });
}
