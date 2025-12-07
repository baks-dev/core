/*
 *  Copyright 2025.  Baks.dev <admin@baks.dev>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is furnished
 *  to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */


/* инициируем события на модальные ссылки */
document.querySelectorAll("[data-bs-toggle=\"modal\"]").forEach(function(item, i, arr)
{
    initModal(item);
});


/** сплывающее модальное окно */
function modalLink(item)
{
    /** Запрещаем повторно инициировать событие */
    if(typeof item.dataset.call !== "undefined")
    {
        return;
    }

    // Обрываем запрос если имеется класс prnt
    if(item.classList.contains("prnt") === true || item.classList.contains("print") === true)
    {
        item.dataset.call = true;
        return;
    }

    item.addEventListener("click", function(event)
    {
        /** Инициализация FormData для обработки данных ссылок - например раздел Производственный процесс
         *  и передачи в request.send
         */
        const modalData = new FormData();

        // Получить data-formname элемента
        const formname = item.dataset.formname;

        /** Показываем прелоад модального окна */
        document.querySelector("#modal .spinner-border")?.classList.remove("d-none");

        /* Отключаем дефолтный переход по ссылке */
        event.preventDefault();

        /* Создаём объект класса XMLHttpRequest */
        const request = new XMLHttpRequest();

        /*  Получаем из ссылки адрес запроса */
        let url = null;

        if(this.href)
        {
            url = item.href;
        }
        else
        {
            url = item.dataset.href;
        }

        if(!url)
        {
            return;
        }

        /** Указываем метод отправки запроса */
        /* Пример задания data-method - baks-dev/manufacture-part/Resources/view/admin/index/pc/content.html.twig */
        let METHOD = typeof item.dataset.method === "undefined" ? "GET" : item.dataset.method;

        /** Обработка dataset и добавление в formData */
        const processFormData = function(item, collection_form_name, i)
        {
            if(typeof item.dataset.formname === "undefined")
            {
                return false;
            }

            const dataAttributes = item.dataset; // Получаем все data-атрибуты

            // Перебираем все data-атрибуты
            for(const name in dataAttributes)
            {

                /* Пропустить элемент formname */
                if(name !== "formname")
                {
                    const elem_formname = formname === "undefined" ? item.dataset.formname : formname;
                    modalData.append(elem_formname + "[" + collection_form_name + "]" + "[" + i + "][" + name + "]", dataAttributes[name]);
                }
            }
        };

        /** Обработка данных - dataset ссылок, пример - Производственный процесс baks-dev/manufacture-part
         * Цель - возможность отправки данных в POST-запросе
         */

        /** Для реализации работы необходимо для элемента указать следующие атрибуты:
         *  data-formname - здесь передается имя формы, передаем в контроллере, например:
         *    baks-dev/manufacture-part/Controller/Admin/IndexController.php
         *     $this->createForm(type: ManufactureSelectionPartProductsForm::class)->getName()
         *  data-collection-form - название поля CollectionType формы, например:
         *    baks-dev/manufacture-part/UseCase/Admin/AddProduct/ManufactureSelectionPartProductsForm.php
         * А также атрибуты для передачи данных, например:
         *   data-product
         *   data-offer
         *   data-variation
         *   data-modification
         */

        /* Если имеются аттрибут data-formname - получаем данные для отправки */
        /** Если передан data-post-class атрибут - проходимся циклом для формирования запроса  */
        if(item.dataset.postClass)
        {

            let className = item.dataset.postClass;

            // Получим атрибут элемента коллекции форм data-collection-form
            const collection_form_name = item.dataset.collectionForm;

            /* Если выбран один товар (нажата ссылка) то добавляем только один элемент */
            if(item.dataset.postClass === "add-one-to-collection")
            {
                processFormData(item, collection_form_name, 0);
            }

            // Если выбраны несколько товаров (checkboxes) - добавляем несколько выбранных элементов в FormData
            else
            {
                /** Получаем все элементы по классу */
                document.querySelectorAll("." + className + ":checked").forEach(function(item, i, arr)
                {
                    processFormData(item, collection_form_name, i);
                });
            }
        }


        /* Указываем метод соединения GET или POST и путь к файлу на сервере */
        request.open(METHOD, url);

        /* Указываем заголовки для сервера */
        request.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        /* Получаем ответ от сервера на запрос*/
        request.addEventListener("readystatechange", function(evemnt)
        {
            /* request.readyState - возвращает текущее состояние объекта XHR(XMLHttpRequest) */
            if(request.readyState === 4 && request.status === 200)
            {

                const modal = document.getElementById("modal");

                modal.innerHTML = request.responseText;

                /* делаем глобальную отметку о завершении запроса */
                //eventEmitter.dispatchEvent(new Event('complete'));

                /////////////////////////////////////////////////////////////////////////////////////////


                /* Сбрасываем содержимое модального окна при закрытии */
                modal.addEventListener("hidden.bs.modal", function(event)
                {
                    this.innerHTML = "<div class=\"modal-dialog modal-dialog-centered\"><div class=\"d-flex justify-content-center w-100\"><div class=\"spinner-border text-light\" role=\"status\"><span class=\"visually-hidden\">Loading...</span></div></div></div>";
                });


                /** Пересобирваем tooltip */
                modal.addEventListener("shown.bs.modal", function(event)
                {
                    var tooltipTriggerList = [].slice.call(modal.querySelectorAll("[data-bs-toggle=\"tooltip\"]"));

                    tooltipTriggerList.map(function(tooltipTriggerEl)
                    {
                        return new bootstrap.Tooltip(tooltipTriggerEl);
                    });
                });


                /* Если в модальном окне присутствует select2 */
                modal.querySelectorAll("[data-select=\"select2\"]").forEach(function(item)
                {
                    new NiceSelect(item, {searchable : true});
                });


                /*
                 * Если в модальном окне присутствуют модальные ссылки
                 * Важно! Внутри модальных окон должен отсутствовать аттрибут data-bs-toggle !!!
                 */
                modal.querySelectorAll("[data-bs-target=\"#modal\"]").forEach(function(item, i, arr)
                {
                    modalLink(item);
                });


                //modal.querySelectorAll("form").forEach(function(forms)
                //{

                /* событие отправки формы */
                //forms.addEventListener("submit", function(event)
                //{
                //    event.preventDefault();
                //    submitModalForm(forms);
                //    return false;
                //});
                // });


                var tooltipTriggerList = [].slice.call(modal.querySelectorAll("[data-bs-toggle=\"tooltip\"]"));

                tooltipTriggerList.map(function(tooltipTriggerEl)
                {
                    const tooltipInstance = new bootstrap.Tooltip(tooltipTriggerEl);

                    tooltipTriggerEl.addEventListener("click", event =>
                    {
                        tooltipInstance.hide();
                    });

                    return tooltipInstance;
                });

                if($html)
                {
                    $html = request.responseText;
                }

                let lazy = document.createElement("script");
                lazy.src = "/assets/" + $version + "/js/lazyload.min.js?v=" + Date.now();
                document.head.appendChild(lazy);


                let urlObject = createValidUrl(url);


                // условие, если есть GET параметр print - вызываем диалоговое окно
                if(urlObject.searchParams.has("print") && urlObject.searchParams.get("print") === "1")
                {
                    window.print();

                    /* Закрываем модальное окно */
                    setTimeout(function()
                    {
                        ///myModalEl.addEventListener('shown.bs.modal', () => {
                        let currentmodal = bootstrap.Modal.getOrCreateInstance(modal);
                        currentmodal.hide();

                        document.getElementById("prnt").innerHTML = "";

                    }, 10);

                }
            }
            else
            {

                if(request.status === 302)
                {
                    let requestJson = JSON.parse(request.response);
                    if(requestJson.redirect)
                    {
                        window.location.href = requestJson.redirect;
                    }
                }
            }
        });

        /*Выполняем запрос*/
        request.send(modalData);

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

    item.dataset.call = true;
}


