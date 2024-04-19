/*
 *  Copyright 2023.  Baks.dev <admin@baks.dev>
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

//printer = document.querySelector('#printer');
//
//if (printer)
//{
//    printer.addEventListener('click', printOne);
//
//    function printOne() {
//
//        setTimeout(function () {
//
//            /* Закрываем модальное окно */
//            let myModalEl = document.querySelector('#modal');
//
//            if (myModalEl)
//            {
//                let modal = bootstrap.Modal.getOrCreateInstance(myModalEl);
//                modal.hide();
//            }
//
//        }, 500);
//
//        window.print();
//    }
//}
//else
//{
//    print_all = document.querySelector('#print_all');
//
//    if (print_all)
//    {
//        print_all.classList.remove('d-none');
//
//        print_all.addEventListener('click', printAll);
//
//        function printAll() {
//
//            setTimeout(function () {
//
//                /* Закрываем модальное окно */
//                let myModalEl = document.querySelector('#modal');
//
//                if (myModalEl)
//                {
//                    let modal = bootstrap.Modal.getOrCreateInstance(myModalEl) // Returns a Bootstrap modal instance
//                    modal.hide();
//                }
//
//            }, 500);
//
//            window.print();
//
//        }
//
//    }
//}

document.querySelectorAll('.prnt').forEach(function(element, i, arr)
{

    element.classList.remove('prnt');
    element.classList.remove('d-none');

    if(element.dataset.href || element.href)
    {
        element.addEventListener('click', printElement);
    }

});

function printElement()
{

    /* Отключаем дефолтный переход по ссылке если */
    event.preventDefault();

    /* Создаём объект класса XMLHttpRequest */
    const request = new XMLHttpRequest();

    /*  Получаем из ссылки адрес запроса */
    let url = null;

    if(this.href)
    {
        url = this.href;
    } else if(this.dataset.href)
    {
        url = this.dataset.href
    }

    if(!url)
    {
        return;
    }


    /* Указываем метод соединения GET и путь к файлу на сервере */
    request.open('GET', url);
    /* Указываем заголовки для сервера */
    //request.setRequestHeader('Content-Type', 'application/x-www-form-url');
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    /* Получаем ответ от сервера на запрос*/
    request.addEventListener("readystatechange", function(evemnt)
    {


        /* request.readyState - возвращает текущее состояние объекта XHR(XMLHttpRequest) */
        if(request.readyState === 4 && request.status === 200)
        {

            const prnt = document.getElementById('prnt');

            if(prnt)
            {
                prnt.innerHTML = request.responseText;

                /* Закрываем модальное окно */
                let myModalEl = document.querySelector('#modal');

                if(myModalEl)
                {
                    setTimeout(function()
                    {
                        ///myModalEl.addEventListener('shown.bs.modal', () => {
                        let modal = bootstrap.Modal.getOrCreateInstance(myModalEl);
                        modal.hide();

                        myModalEl.addEventListener('hidden.bs.modal', printers);

                    }, 500);

                }
            }
        }
    });

    /*Выполняем запрос*/
    request.send();

    return false;

}

function printers()
{
    window.print();
    document.getElementById('prnt').innerHTML = '';

    /* Удаляем прослушиватель событий  */
    let myModalEl = document.querySelector('#modal');
    myModalEl.removeEventListener('hidden.bs.modal', printers);

}