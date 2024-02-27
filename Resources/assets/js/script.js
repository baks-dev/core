//eventEmitter = new EventTarget();
$html = false;

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

            const tooltipInstance = new bootstrap.Tooltip(tooltipTriggerEl);

            tooltipTriggerEl.addEventListener('click', event => {
                tooltipInstance.hide();
            });

            return tooltipInstance;
        });

        var toastElList = [].slice.call(document.querySelectorAll('.toast'));
        toastElList.map(function (toastEl) {
            return new bootstrap.Toast(toastEl, {delay: 15000}).show();
        });

        //$('.carousel-inner').carousel({interval: 2000});

        // var offcanvasElList = [].slice.call(document.querySelectorAll('.offcanvas'));
        // offcanvasElList.map(function (offcanvaslEl) {
        //     return new bootstrap.Offcanvas(offcanvaslEl);
        // });


        /** Добавляем  */
        const triggerTabList = document.querySelectorAll('.nav-mouse li')
        triggerTabList.forEach(triggerEl => {
            const tabTrigger = new bootstrap.Tab(triggerEl)

            triggerEl.addEventListener('mouseover', event => {
                event.preventDefault()
                tabTrigger.show()
            })
        })


        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));


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

                    if (popoverTriggerEl.id) {
                        let content = document.getElementById(popoverTriggerEl.id + '-content');

                        if (content) {
                            return content.innerHTML;
                        }
                    }
                },

                title: function () {

                    if (popoverTriggerEl.id) {
                        let title = document.getElementById(popoverTriggerEl.id + '-title');
                        if (title) {
                            return title.innerHTML;
                        }
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


/* вешаем события на модальные ссылки */
document.querySelectorAll('.modal-link')
    .forEach(function (item, i, arr) {
        modalLink(item);
    });


/* вешаем события на OFFCANVAS */
document.querySelectorAll('.offcanvas-link')
    .forEach(function (item, i, arr) {
        item.addEventListener('click', function () {
            offcanvasLink(item);
        });
    });


async function offcanvasLink(offcanvas) {


    //const data = new FormData(forms);

    await fetch(offcanvas.dataset.href, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        //mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        //body: data // body data type must match "Content-Type" header
    })

        //.then((response) => response)
        .then((response) => {

            if (response.status !== 200) {
                return false;
            }

            return response.text();
        })

        .then((data) => {

            if (data) {


                // var offcanvasElList = [].slice.call(document.querySelectorAll('.offcanvas'));
                // offcanvasElList.map(function (offcanvaslEl) {
                //      new bootstrap.Offcanvas(offcanvaslEl);
                // });

                //document.getElementById()


                var myOffcanvas = document.getElementById('offcanvas');
                var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);

                //console.log(myOffcanvas);


                myOffcanvas.innerHTML = data;

                bsOffcanvas.show();


                //console.log(data);

                // var parser = new DOMParser();
                // var doc = parser.parseFromString(data, 'text/html');
                //
                // let user_delivery = doc.getElementById('user_delivery');
                // document.getElementById('user_delivery').replaceWith(user_delivery);
                //
                // /** Пересобираем поля для способа дотсавки */
                // document.querySelectorAll('input[name="order_form[users][delivery][delivery]"]').forEach(function (user_delivery) {
                //     user_delivery.addEventListener('change', function (event) {
                //
                //         let forms = this.closest('form');
                //         submitDeliveryForm(forms);
                //         return false;
                //     });
                // });
                //
                //
                // document.querySelectorAll('select.change_region_field').forEach(function (userRegion) {
                //     userRegion.addEventListener('change', function (event) {
                //         let forms = this.closest('form');
                //         submitRegionForm(forms, userRegion.id);
                //         return false;
                //     });
                // });
                //
                // /** Делаем перерасчет */
                //
                //
                // /** Пересобирваем tooltip */
                // var tooltipTriggerList = [].slice.call(user_delivery.querySelectorAll('[data-bs-toggle="tooltip"]'))
                // tooltipTriggerList.map(function (tooltipTriggerEl) {
                //     return new bootstrap.Tooltip(tooltipTriggerEl);
                // });
                //
                // /** Персчет всего количество */
                // total();

            }
        });


    return false;


    // .catch((error) => {
    //     console.error('Error:', error);
    // }); // parses JSON response into native JavaScript objects
}

/** сплывающее модальное окно */
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
        //request.setRequestHeader('Content-Type', 'application/x-www-form-url');
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');


        /* Получаем ответ от сервера на запрос*/
        request.addEventListener("readystatechange", function (evemnt) {
            /* request.readyState - возвращает текущее состояние объекта XHR(XMLHttpRequest) */
            if (request.readyState === 4 && request.status === 200) {

                const modal = document.getElementById('modal');

                modal.innerHTML = request.responseText;

                /* делаем глобальную отметку о завершении запроса */
                //eventEmitter.dispatchEvent(new Event('complete'));

                /* Сбрасываем содержимое модального окна при закрытии */
                modal.addEventListener('hidden.bs.modal', function (event) {
                    this.innerHTML = '<div class="modal-dialog modal-dialog-centered"><div class="d-flex justify-content-center w-100"><div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading...</span></div></div></div>';
                })

                /* Если в модальном окне присутствует select2 */
                modal.querySelectorAll('[data-select="select2"]').forEach(function (item) {
                    new NiceSelect(item, {searchable: true});
                });


                /* Если в модальном окне присутствует select2 */
                modal.querySelectorAll('.modal-link').forEach(function (item, i, arr) {
                    modalLink(item);

                    //modalToggle = document.getElementById('modal');
                    //bootstrap.Modal.getInstance(modalToggle).show();

                });


                modal.querySelectorAll('form').forEach(function (forms) {

                    //console.log(forms);

                    /* событие отправки формы */
                    forms.addEventListener('submit', function (event) {
                        event.preventDefault();
                        submitModalForm(forms);
                        return false;
                    });
                });

                if ($html) {
                    $html = request.responseText;
                }

                //window.lazyLoadOptions = {};
                //LazyLoad.reset()


                let lazy = document.createElement('script');
                lazy.src = '/assets/js/lazyload.min.js?v={{ version }}';
                document.head.appendChild(lazy);

            } else {


                if (request.status === 302) {
                    let requestJson = JSON.parse(request.response);
                    if (requestJson.redirect) {
                        window.location.href = requestJson.redirect;
                    }
                }


                // console.log(request.responseText);

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


/** Отправка модального окна */
async function submitModalForm(forms) {

    const data = new FormData(forms);
    let resolved = 100;

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

            closeProgress();
            btn.type = 'submit';

            const contentType = response.headers.get('content-type');

            if (!contentType || !contentType.includes('application/json')) {

                $errorFormHandler = '{ "type":"danger" , ' +
                    '"header":"Ошибка"  , ' +
                    '"message" : "Возникла ошибка при заполнении" }';

                createToast(JSON.parse($errorFormHandler));


                throw new TypeError("Oops, we haven't got JSON!");
            }

            /* Закрываем модальное окно */
            let myModalEl = document.querySelector('#modal')
            let modal = bootstrap.Modal.getOrCreateInstance(myModalEl) // Returns a Bootstrap modal instance
            modal.hide();

            return response.json();

        })

        .then((data) => {

            if (data === undefined) {

                return false;
            }

            if (data.status === 302) {

                if (data.redirect == undefined) {
                    window.location.href = '/refresh';
                    return;
                }

                window.location.href = data.redirect;
                return false;
            }

            createToast(data);

            if (data.status !== 200) {
                return;
            }

            setTimeout(function initResolve() {
                if (typeof resolve == 'function') {
                    resolve(data);
                    return;
                }
                console.log('resolve not found');

                if (resolved > 1000) {
                    return;
                }
                resolved = resolved * 2;
                setTimeout(initResolve, resolved);

            }, 100);
        });


    return false;


    // .catch((error) => {
    //     console.error('Error:', error);
    // }); // parses JSON response into native JavaScript objects
}

/** Отправка по ссылке */
async function submitLink(href, id = null) {

    let resolved = 100;

    // /* показываем индикатор */
    //let indicator = forms.querySelector('.spinner-border');

    await fetch(href, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        //mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url

    })

        .then((response) => {

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {

                $errorFormHandler = '{ "type":"danger" , ' +
                    '"header":"Ошибка"  , ' +
                    '"message" : "Возникла ошибка при заполнении" }';

                createToast(JSON.parse($errorFormHandler));

                throw new TypeError("Oops, we haven't got JSON!");
            }

            return response.json();
        })

        .then((data) => {

            if (data === undefined) {

                return false;
            }

            if (data.status === 302) {

                if (data.redirect == undefined) {
                    window.location.href = '/refresh';
                    return;
                }

                window.location.href = data.redirect;
                return false;
            }

            setTimeout(function HunLIOPGlZ() {

                console.log(typeof resolve);

                if (typeof resolve == 'function') {
                    resolve(data);
                    return;
                }

                console.log('resolve not found');

                if (resolved > 1000) {
                    return;
                }
                resolved = resolved * 2;
                setTimeout(HunLIOPGlZ, resolved);

            }, 100);


            createToast(data);

            if (data.status !== 200) {
                return;
            }

            if (typeof success !== undefined && id !== null) {
                success(id);
            }


        });


    return false;
}


checked_item = document.querySelectorAll('.checked-item');
all_usecase = document.getElementById('all_usecase');

function checkedAll($this) {


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


mybutton = document.getElementById("btn-back-to-top");
mybuttonEnd = document.getElementById("btn-back-to-end");

/* Когда пользователь прокручивает вниз 20 пикселей от верха документа, показываем кнопку */
if (mybutton || mybuttonEnd) {
    window.onscroll = function () {
        scrollFunction();
    };

    /* Когда пользователь нажимает кнопку, прокручиваем до верхней части старницы. */
    mybutton.addEventListener("click", backToTop);
    mybuttonEnd.addEventListener("click", backToEnd);
}


/*var modal = new bootstrap.Modal('#typeForm');
document.addEventListener('closeModal', () => {
    modal.hide();
});*/


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

                /* событие отправки формы */
                frm.addEventListener('submit', function (event) {
                    event.preventDefault();
                    return false;
                });

                if (frm) {

                    let formSubmit = true;

                    Array.from(frm.elements).forEach((input) => {
                        let $errorFormHandler = false;

                        if (input.validity.valid === false) {

                            formSubmit = false;

                            let $placeholderText = false;

                            setTimeout(closeProgress, 1000);

                            /* Поиск полей по LABEL */
                            $label = document.querySelector('label[for="' + input.id + '"]');
                            $placeholderText = $label ? $label.innerHTML : false;

                            if (!$placeholderText) {
                                /* Поиск полей по Placeholder */
                                $placeholderInput = document.querySelector('#' + input.id + '');

                                if ($placeholderInput.tagName === 'SELECT') {
                                    /* если элемент SELECT - получаем placeholder по первому элементу списка в empty value  */
                                    const firstOption = $placeholderInput.options[0];
                                    $placeholderText = firstOption.value === '' ? firstOption.textContent : false;
                                } else {
                                    $placeholder = $placeholderInput.getAttribute('placeholder');
                                    $placeholderText = $placeholder ? $placeholder : false;
                                }
                            }

                            if ($placeholderText) {
                                $errorFormHandler = '{ "type":"danger" , ' +
                                    '"header":"Ошибка заполнения"   , ' +
                                    '"message" : "' + $placeholderText + '"}';

                                if ($errorFormHandler !== false) {
                                    createToast(JSON.parse($errorFormHandler));
                                }
                            }
                        }

                    });

                    /** Если форма добавления в корзину */
                    if (frm.classList.contains('order-basket')) {
                        return;
                    }

                    if (formSubmit) {
                        frm.submit()
                    }
                }
            }

            ///** Максимально крутим спинер - 3 сек */
            setTimeout(closeProgress, 3000);
        });
    }
});


function closeProgress() {
    document.querySelectorAll('.spinner-border').forEach(function (indicator) {

        indicator.classList.add('d-none');

        let btn = indicator.closest('.btn');

        if (btn) {
            btn.disabled = false;
            btn.removeAttribute('disabled');
        }
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


selectPagination = document.getElementById('select-pagination');
if (selectPagination) {
    selectPagination.addEventListener('change', function (event) {
        this.form.submit();
    });
}


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
                new bootstrap.Toast(toastEl, {delay: 15000}).show();
                return;
            }

            setTimeout(showToast, 500);

        }, 500);

    }
}


/* TODO RESET */

/*document.querySelectorAll('[type="reset"]').forEach(function (reset) {
    reset.addEventListener('click', function (event) {
        let elements_form = reset.closest('form').elements;

        for (const element of elements_form) {

            if (element.type == 'radio')
            {

                if (!element.value || element.value.length === 0 )
                {
                    // console.log(element);
                    // element.setAttribute('checked', true)
                    // element.checked = true;
                }
            }
        }
    });
});*/

