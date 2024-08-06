const scrollElements = document.querySelectorAll('[data-scroll]');

scrollElements.forEach(element =>
{
    element.addEventListener('click', () =>
    {
        const elementId = element.dataset.scroll;
        const position = element.dataset.scrollPosition || 'center'; // Добавьте опциональную позицию
        scrollToElement(elementId, position);

        if(typeof bootstrap !== 'object')
        {
            return;
        }

        /** Срываем все раскрытые dropdown */
        document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(menu =>
        {
            (bootstrap.Dropdown.getInstance(menu))?.hide();
        });

        /** Срываем все раскрытые offcanvas */
        document.querySelectorAll('.offcanvas').forEach(menu =>
        {
            (bootstrap.Offcanvas.getInstance(menu))?.hide();
        });
    });
});


/**
 * Функция скролит страницу до элемента. К элементу, при клике по которому произойдет скрол, необходимо добавить аттрибут
 *
 * data-scroll = "elementId" - указать идентификатор элемента к которому скролить
 * data-scroll-position = "top|center|bottom" - опционально можно указать как позиционировать этот элемент (По умолчанию - по центру)
 *
 */

function scrollToElement(elementId, position = 'center')
{

    const element = document.getElementById(elementId);

    if(!element)
    {
        console.error(`Элемент с ID "${elementId}" не найден!`);
        return;
    }

    let scrollTop = 0;

    switch(position)
    {
        case 'top':
            scrollTop = element.offsetTop;
            break;
        case 'bottom':
            scrollTop = element.offsetTop + element.offsetHeight;
            break;
        case 'center':
        default:
            scrollTop = element.offsetTop + (element.offsetHeight / 2) - (window.innerHeight / 2);
            break;
    }

    window.scrollTo({
        top: scrollTop, behavior: 'smooth'
    });
}