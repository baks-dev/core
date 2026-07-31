(function(global, factory)
{
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() :
        typeof define === "function" && define.amd ? define(factory) :
            (global = global || self, global.LazyLoad = factory());
}(this, (function()
{
    "use strict";

    /**
     * Рекурсивное расширение объектов (аналог Object.assign)
     * Используется для объединения настроек по умолчанию с пользовательскими настройками
     * @returns {Object} - Объект, содержащий свойства всех переданных объектов-аргументов
     */
    function _extends()
    {

        // console.log('START _extends');

        _extends = Object.assign || function(target)
        {
            // Проходим по всем аргументам, начиная со второго (первый - целевой объект)
            for(var i = 1; i < arguments.length; i++)
            {
                var source = arguments[i];

                // Копируем только собственные свойства источника в целевой объект
                for(var key in source)
                {
                    if(Object.prototype.hasOwnProperty.call(source, key))
                    {
                        target[key] = source[key];
                    }
                }
            }

            return target;
        };

        // console.log('END _extends');
        // console.log('*');
        // console.log('*');
        // console.log('*');

        return _extends.apply(this, arguments);
    }

    /**
     * Флаг указывает на то, что код выполняется в браузере (не в Node.js и подобных средах)
     */
    var runningOnBrowser = typeof window !== "undefined";

    // Переменная для проверки, является ли пользователь ботом (закомментирована, так как используется альтернативный подход с массивом правил)
    //var isRobot = runningOnBrowser && !("onscroll" in window) || typeof navigator !== "undefined" && /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent);

    /**
     * Флаг поддержки IntersectionObserver API - позволяет отслеживать видимость элементов на странице
     */
    var supportsIntersectionObserver = runningOnBrowser && "IntersectionObserver" in window;

    /**
     * Флаг поддержки classList API для удобной работы с CSS-классами
     */
    var supportsClassList = runningOnBrowser && "classList" in document.createElement("p");

    /**
     * Флаг наличия High-DPI (Retina) экрана - определяет необходимость загрузки изображений высокого разрешения
     */
    var isHiDpi = runningOnBrowser && window.devicePixelRatio > 1;

    /**
     * Инициализируется как false, но может быть установлен в true при обнаружении бота по совокупности признаков
     * Используется для отключения отложенной загрузки на ботах (они и так не используют lazy-load)
     */
    var isRobot = false;

    /**
     * Массив функций-правил для определения, является ли среда средой бота/робота
     * Каждая функция возвращает true если обнаружен признак бота
     * Если хотя бы одно правило вернет true - переменная isRobot установится в true
     */
    var rules = [

        // Правило 1: Отсутствие события onscroll указывает на среду без интерактивности (bot)
        () => runningOnBrowser && !("onscroll" in window),

        // Правило 2: Проверка User-Agent на наличие признаков ботов Google, Bing, Yandex, Alexa и т.д.
        () => typeof navigator !== "undefined" && /(gle|ing|ro|dex|ya)bot|crawl|spider/i.test(navigator.userAgent),

        // Правило 3: PhantomJS как правило не имеет установленных плагинов (plugins.length === 0)
        () => typeof navigator !== "undefined" && navigator.plugins instanceof PluginArray === false,

        // Правило 4 (закомментировано): Проверка свойства mobile в userAgentData (может давать ложные срабатывания на старых устройствах)

        // Правило 5: PhantomJS 1.x прокидывает свойства callPhantom или _phantom в глобальный объект
        () => (window.callPhantom || window._phantom),

        // Правило 6: Устаревшие браузеры могут не поддерживать Function.prototype.bind
        () => (!Function.prototype.bind),

        // Правило 7: В Node.js у window есть свойство Buffer (отсутствует в браузерах)
        () => window.Buffer !== undefined,

        // Правило 8: CoachJS добавляет в window метод emit
        () => window.emit !== undefined,

        // Правило 9: Rhino (JS-движок на Java) добавляет в window метод spawn
        () => window.spawn !== undefined,

        // Правило 10: WebDriver (используется Selenium и некоторыми ботами) добавляет свойство webdriver
        () => window.webdriver !== undefined,

        // Правило 11: Chrome automation DOM (используется для автоматизации и ботами)
        () => window.domAutomation !== undefined || window.domAutomationController !== undefined,

        // Правило 12: Headless браузеры (без GUI) не имеют размера окна - outerWidth/outerHeight равны 0
        // WARNING: Может давать ложные срабатывания на iOS 8 и ниже, а также в Sailfish Webview
        () => window.outerWidth === 0 && window.outerHeight === 0,

        // Правило 13: Многие боты ходят по сайту в оффлайн режиме (navigator.onLine === false)
        () => window.navigator.onLine === false,
    ];

    /**
     * Проходит по всем правилам и проверяет, не является ли среда ботом
     * Если найдено хотя бы одно совпадение - устанавливает isRobot в true
     */
    for(let i = 0; i < rules.length; i++)
    {
        if(rules[i]() === true)
        {
            isRobot = true;
            break; // Прерываем проверку при первом же совпадении
        }
    }

    /**
     * Объект с настройками по умолчанию для инициализации LazyLoad
     * Каждый параметр описан в комментариях ниже:
     */
    var defaultSettings = {
        // CSS-селектор элементов, которые должны откладываться при загрузке (по умолчанию все элементы с классом "lazy")
        elements_selector : ".lazy",

        // Контейнер, внутри которого отслеживается видимость элементов (по умолчанию document - вся страница)
        container : isRobot || runningOnBrowser ? document : null,

        // Пороговое расстояние (в пикселях) до элемента, когда он начинает загружаться
        // Элемент начнет загружаться за threshold пикселей до появления в области видимости
        threshold : 300,

        // Дополнительные пороговые значения для IntersectionObserver (массив коэффициентов от 0 до 1)
        thresholds : null,

        // Имя data-атрибута, содержащего URL основного изображения (используется как data-src="...")
        data_src : "src",

        // Имя data-атрибута для srcset (множество версий изображения для разных разрешений)
        data_srcset : "srcset",

        // Имя data-атрибута для sizes (размеры изображения при разных условиях)
        data_sizes : "sizes",

        // Имя data-атрибута для обычного фонового изображения
        data_bg : "bg",

        // Имя data-атрибута для фонового изображения высокого разрешения (HiDPI)
        data_bg_hidpi : "bg-hidpi",

        // Имя data-атрибута для множественных фоновых изображений (CSS background-image с градиентами и т.д.)
        data_bg_multi : "bg-multi",

        // Имя data-атрибута для множественных фоновых изображений высокого разрешения
        data_bg_multi_hidpi : "bg-multi-hidpi",

        // Имя data-атрибута для poster (превью) в видеоэлементах
        data_poster : "poster",

        // CSS-класс, добавляемый элементу при применении настроек (появился в поле зрения)
        class_applied : "applied",

        // CSS-класс, добавляемый элементу во время загрузки
        class_loading : "loading",

        // CSS-класс, добавляемый успешно загруженному элементу
        class_loaded : "loaded",

        // CSS-класс, добавляемый элементу при ошибке загрузки
        class_error : "error",

        // CSS-класс для элемента, который вошел в поле зрения (Entered)
        class_entered : "entered",

        // CSS-класс для элемента, который вышел из поля зрения (Exited)
        class_exited : "exited",

        // Если true - отменяет наблюдение за элементом после завершения загрузки
        unobserve_completed : true,

        // Если true - отменяет наблюдение после того как элемент вошел в поле зрения
        unobserve_entered : false,

        // Если true - отменяет загрузку при выходе элемента из поля зрения (для IMG тегов)
        cancel_on_exit : true,

        // Callback-функция, вызываемая когда элемент входит в поле зрения
        callback_enter : null,

        // Callback-функция, вызываемая когда элемент выходит из поля зрения
        callback_exit : null,

        // Callback-функция, вызываемая когда к элементу применяются настройки
        callback_applied : null,

        // Callback-функция, вызываемая при начале загрузки элемента
        callback_loading : null,

        // Callback-функция, вызываемая после успешной загрузки элемента
        callback_loaded : null,

        // Callback-функция, вызываемая при ошибке загрузки элемента
        callback_error : null,

        // Callback-функция, вызываемая когда все элементы загружены
        callback_finish : null,

        // Callback-функция, вызываемая при отмене загрузки элемента (при выходе из поля зрения)
        callback_cancel : null,

        // Если true - использует нативную lazy-load поддержку браузера (attribute loading="lazy")
        use_native : false,
    };

    /**
     * Объединяет пользовательские настройки с настройками по умолчанию
     * @param {Object} customSettings - Пользовательские настройки, которые переопределят значения по умолчанию
     * @returns {Object} - Слияние defaultSettings и customSettings
     */
    var getExtendedSettings = function getExtendedSettings(customSettings)
    {
        return _extends({}, defaultSettings, customSettings);
    };

    /**
     * Создает экземпляр LazyLoad и уведомляет о его инициализации через событие на window
     * @param {Function} classObj - Конструктор класса LazyLoad
     * @param {Object} options - Параметры конфигурации для этого экземпляра
     */
    var createInstance = function createInstance(classObj, options)
    {
        var event;
        // Строка с именем события, которое будет отправлено при инициализации
        var eventString = "LazyLoad::Initialized";

        // Создаем новый экземпляр класса LazyLoad с переданными настройками
        var instance = new classObj(options);

        try
        {
            // Создание кастомного события в современных браузерах
            event = new CustomEvent(eventString, {
                detail : {
                    instance : instance,
                },
            });
        }
        catch(err)
        {
            // Fallback для Internet Explorer (все версии) - создание события через старый API
            event = document.createEvent("CustomEvent");
            event.initCustomEvent(eventString, false, false, {
                instance : instance,
            });
        }

        // Отправка события на глобальный объект window
        window.dispatchEvent(event);
    };

    /**
     * Автоматическая инициализация одного или нескольких экземпляров LazyLoad
     * @param {Function} classObj - Конструктор класса LazyLoad
     * @param {Object|Array} options - Один объект настроек или массив объектов для создания нескольких инстансов
     */
    var autoInitialize = function autoInitialize(classObj, options)
    {
        // Если options не передан - выходим
        if(!options)
        {
            return;
        }

        // Проверка: если у options нет свойства length (это массив) - это обычный объект
        if(!options.length)
        {
            createInstance(classObj, options);
        }
        else
        {
            // Если options - массив, создаем отдельный экземпляр для каждого элемента
            for(var i = 0, optionsItem; optionsItem = options[i]; i += 1)
            {
                createInstance(classObj, optionsItem);
            }
        }
    };

    /**
     * Строковые константы, представляющие различные состояния элементов в процессе загрузки
     */
    var statusLoading = "loading";      // Элемент начинает загружаться
    var statusLoaded = "loaded";        // Элемент успешно загружен
    var statusApplied = "applied";      // Настройки применены, элемент вошел в поле зрения
    var statusEntered = "entered";      // Элемент вошел в область видимости (IntersectionObserver)
    var statusError = "error";          // Ошибка при загрузке
    var statusNative = "native";        // Используется нативная lazy-load поддержка браузера

    /**
     * Префикс для data-атрибутов HTML
     */
    var dataPrefix = "data-";

    /**
     * Имя data-атрибута, в котором хранится текущий статус элемента (ll-status)
     */
    var statusDataName = "ll-status";

    /**
     * Получает значение data-атрибута элемента
     * @param {HTMLElement} element - HTML-элемент
     * @param {string} attribute - Имя атрибута без префикса "data-"
     * @returns {string|null} Значение атрибута или null если не найден
     */
    var getData = function getData(element, attribute)
    {
        return element.getAttribute(dataPrefix + attribute);
    };

    /**
     * Устанавливает значение data-атрибута элемента
     * Для статуса "error" также добавляет CSS-классы для визуального выделения ошибки
     * @param {HTMLElement} element - HTML-элемент
     * @param {string} attribute - Имя атрибута без префикса "data-"
     * @param {string|null} value - Значение для установки (null - удаляет атрибут)
     */
    var setData = function setData(element, attribute, value)
    {
        var attrName = dataPrefix + attribute;

        if(value === null)
        {
            element.removeAttribute(attrName);
            return;
        }

        // Если статус "error" - добавляем CSS-классы для визуального выделения (Bootstrap стили)
        if(value === "error")
        {
            element.classList.add("border");
            element.classList.add("border-danger");
        }

        element.setAttribute(attrName, value);
    };

    /**
     * Получает текущий статус элемента из data-атрибута ll-status
     * @param {HTMLElement} element - HTML-элемент
     * @returns {string|null}
     */
    var getStatus = function getStatus(element)
    {
        return getData(element, statusDataName);
    };

    /**
     * Устанавливает статус элемента в data-атрибут ll-status
     * @param {HTMLElement} element - HTML-элемент
     * @param {string} status - Новый статус (loading, loaded, applied, error, entered, native)
     * @returns {void}
     */
    var setStatus = function setStatus(element, status)
    {
        return setData(element, statusDataName, status);
    };

    /**
     * Сбрасывает статус элемента (удаляет data-атрибут ll-status)
     * Используется при повторных попытках загрузки
     * @param {HTMLElement} element - HTML-элемент
     * @returns {void}
     */
    var resetStatus = function resetStatus(element)
    {
        return setStatus(element, null);
    };

    /**
     * Проверяет, имеет ли элемент пустой статус (не был обработан ранее)
     * @param {HTMLElement} element - HTML-элемент
     * @returns {boolean}
     */
    var hasEmptyStatus = function hasEmptyStatus(element)
    {
        return getStatus(element) === null;
    };

    /**
     * Проверяет, находится ли элемент в статусе "loading"
     * @param {HTMLElement} element - HTML-элемент
     * @returns {boolean}
     */
    var hasStatusLoading = function hasStatusLoading(element)
    {
        return getStatus(element) === statusLoading;
    };

    /**
     * Проверяет, имеет ли элемент статус "error" (ошибка загрузки)
     * @param {HTMLElement} element - HTML-элемент
     * @returns {boolean}
     */
    var hasStatusError = function hasStatusError(element)
    {
        return getStatus(element) === statusError;
    };

    /**
     * Проверяет, использует ли элемент нативную lazy-load поддержку браузера
     * @param {HTMLElement} element - HTML-элемент
     * @returns {boolean}
     */
    var hasStatusNative = function hasStatusNative(element)
    {
        return getStatus(element) === statusNative;
    };

    /**
     * Массив статусов, которые элемент проходит после начала загрузки
     * Используется для проверки, начинал ли элемент загружаться ранее
     */
    var statusesAfterLoading = [statusLoading, statusLoaded, statusApplied, statusError];

    /**
     * Проверяет, начал ли элемент уже загружаться (имеет один из статусов после loading)
     * @param {HTMLElement} element - HTML-элемент
     * @returns {boolean}
     */
    var hadStartedLoading = function hadStartedLoading(element)
    {
        return statusesAfterLoading.indexOf(getStatus(element)) >= 0;
    };

    /**
     * Безопасно вызывает callback-функцию, если она существует
     * Поддерживает разное количество аргументов (1-3)
     * @param {Function|null} callback - Callback-функция для вызова
     * @param {*} arg1 - Первый аргумент
     * @param {*} arg2 - Второй аргумент (опционально)
     * @param {*} arg3 - Третий аргумент (опционально)
     */
    var safeCallback = function safeCallback(callback, arg1, arg2, arg3)
    {
        // Если callback не передана - выходим
        if(!callback)
        {
            return;
        }

        // Вызываем callback с разным количеством аргументов в зависимости от того что передано
        if(arg3 !== undefined)
        {
            callback(arg1, arg2, arg3);
            return;
        }

        if(arg2 !== undefined)
        {
            callback(arg1, arg2);
            return;
        }

        callback(arg1);
    };

    /**
     * Добавляет CSS-класс элементу с поддержкой classList API (современные браузеры) или fallback
     * @param {HTMLElement} element - HTML-элемент
     * @param {string} className - Имя добавляемого класса
     */
    var addClass = function addClass(element, className)
    {
        // Если поддерживается classList - используем современный API
        if(supportsClassList)
        {
            element.classList.add(className);
            return;
        }

        // Fallback для старых браузеров без classList
        element.className += (element.className ? " " : "") + className;
    };

    /**
     * Удаляет CSS-класс у элемента с поддержкой classList API или fallback
     * @param {HTMLElement} element - HTML-элемент
     * @param {string} className - Имя удаляемого класса
     */
    var removeClass = function removeClass(element, className)
    {
        if(supportsClassList)
        {
            element.classList.remove(className);
            return;
        }

        // Fallback для старых браузеров: регулярное выражение для удаления класса
        element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ").replace(/^\s+/, "").replace(/\s+$/, "");
    };

    /**
     * Создает временный элемент IMG и сохраняет его в свойство llTempImage элемента
     * Используется для фоновых изображений - temp image позволяет отслеживать загрузку
     * @param {HTMLElement} element - HTML-элемент (обычно div с background-image)
     */
    var addTempImage = function addTempImage(element)
    {
        element.llTempImage = document.createElement("IMG");
    };

    /**
     * Удаляет временное изображение из свойства элемента
     * @param {HTMLElement} element - HTML-элемент
     */
    var deleteTempImage = function deleteTempImage(element)
    {
        delete element.llTempImage;
    };

    /**
     * Получает ссылку на временное изображение элемента
     * @param {HTMLElement} element - HTML-элемент
     * @returns {HTMLImageElement|null}
     */
    var getTempImage = function getTempImage(element)
    {
        return element.llTempImage;
    };

    /**
     * Отменяет наблюдение за элементом через IntersectionObserver
     * Используется когда элемент загружен или выходит из поля зрения
     * @param {HTMLElement} element - HTML-элемент
     * @param {Object|null} instance - Экземпляр LazyLoad (опционально)
     */
    var unobserve = function unobserve(element, instance)
    {
        if(!instance)
        {
            return;
        }

        var observer = instance._observer;
        if(!observer)
        {
            return;
        }

        observer.unobserve(element);
    };

    /**
     * Отключает IntersectionObserver полностью (disconnect)
     * Используется при уничтожении экземпляра LazyLoad
     * @param {IntersectionObserver} observer - Экземпляр IntersectionObserver
     */
    var resetObserver = function resetObserver(observer)
    {
        observer.disconnect();
    };

    /**
     * Отменяет наблюдение за элементом если включена опция unobserve_entered
     * @param {HTMLElement} element - HTML-элемент
     * @param {Object} settings - Текущие настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var unobserveEntered = function unobserveEntered(element, settings, instance)
    {
        if(settings.unobserve_entered)
        {
            unobserve(element, instance);
        }
    };

    /**
     * Обновляет счетчик загружаемых элементов в экземпляре LazyLoad
     * @param {Object|null} instance - Экземпляр LazyLoad
     * @param {number} delta - Изменение (положительное или отрицательное)
     */
    var updateLoadingCount = function updateLoadingCount(instance, delta)
    {
        if(!instance)
        {
            return;
        }

        instance.loadingCount += delta; // Увеличиваем или уменьшаем счетчик
    };

    /**
     * Уменьшает счетчик элементов, которые нужно загрузить (toLoadCount) на 1
     * @param {Object|null} instance - Экземпляр LazyLoad
     */
    var decreaseToLoadCount = function decreaseToLoadCount(instance)
    {
        if(!instance)
        {
            return;
        }

        instance.toLoadCount -= 1;
    };

    /**
     * Устанавливает количество элементов для загрузки (toLoadCount)
     * @param {Object|null} instance - Экземпляр LazyLoad
     * @param {number} value - Новое значение счетчика
     */
    var setToLoadCount = function setToLoadCount(instance, value)
    {
        if(!instance)
        {
            return;
        }

        instance.toLoadCount = value;
    };

    /**
     * Проверяет, есть ли в данный момент что-то загружающееся (loadingCount > 0)
     * @param {Object|null} instance - Экземпляр LazyLoad
     * @returns {boolean}
     */
    var isSomethingLoading = function isSomethingLoading(instance)
    {
        return instance.loadingCount > 0;
    };

    /**
     * Проверяет, остались ли элементы для загрузки (toLoadCount > 0)
     * @param {Object|null} instance - Экземпляр LazyLoad
     * @returns {boolean}
     */
    var haveElementsToLoad = function haveElementsToLoad(instance)
    {
        return instance.toLoadCount > 0;
    };

    /**
     * Извлекает все теги <source> из родительского элемента (для video/picture)
     * @param {HTMLElement} parentTag - Родительский элемент (video или picture)
     * @returns {Array<HTMLSourceElement>} Массив тегов source
     */
    var getSourceTags = function getSourceTags(parentTag)
    {
        var sourceTags = [];

        // Проходим по всем дочерним элементам и выбираем только теги <source>
        for(var i = 0, childTag; childTag = parentTag.children[i]; i += 1)
        {
            if(childTag.tagName === "SOURCE")
            {
                sourceTags.push(childTag);
            }
        }

        return sourceTags;
    };

    /**
     * Устанавливает атрибут элемента только если значение не пустое
     * @param {HTMLElement} element - HTML-элемент
     * @param {string} attrName - Имя атрибута
     * @param {string|null} value - Значение атрибута
     */
    var setAttributeIfValue = function setAttributeIfValue(element, attrName, value)
    {
        if(!value)
        {
            return;
        }

        element.setAttribute(attrName, value);
    };

    /**
     * Удаляет атрибут у элемента
     * @param {HTMLElement} element - HTML-элемент
     * @param {string} attrName - Имя удаляемого атрибута
     */
    var resetAttribute = function resetAttribute(element, attrName)
    {
        element.removeAttribute(attrName);
    };

    /**
     * Проверяет, сохранены ли оригинальные атрибуты элемента (для последующего восстановления)
     * @param {HTMLElement} element - HTML-элемент
     * @returns {boolean}
     */
    var hasOriginalAttributes = function hasOriginalAttributes(element)
    {
        return !!element.llOriginalAttrs; // llOriginalAttrs - внутреннее свойство
    };

    /** ==================== РАБОТА С ИЗОБРАЖЕНИЯМИ (IMG) ==================== */

    /**
     * Сохраняет оригинальные атрибуты изображения перед изменением их на data-атрибуты
     * Это нужно для возможности восстановить оригинал при отмене загрузки
     * @param {HTMLImageElement} element - Элемент <img> или <source>
     */
    var saveOriginalImageAttributes = function saveOriginalImageAttributes(element)
    {
        if(hasOriginalAttributes(element))
        {
            return; // Если уже сохранено - выходим
        }

        var originalAttributes = {};

        // Сохраняем src, srcset и sizes
        originalAttributes["src"] = element.getAttribute("src");
        originalAttributes["srcset"] = element.getAttribute("srcset");
        originalAttributes["sizes"] = element.getAttribute("sizes");

        // Сохраняем в внутреннем свойстве элемента
        element.llOriginalAttrs = originalAttributes;
    };

    /**
     * Восстанавливает оригинальные атрибуты изображения (при отмене загрузки)
     * @param {HTMLImageElement} element - Элемент <img> или <source>
     */
    var restoreOriginalImageAttributes = function restoreOriginalImageAttributes(element)
    {
        if(!hasOriginalAttributes(element))
        {
            return;
        }

        var originalAttributes = element.llOriginalAttrs;

        // Восстанавливаем все три атрибута
        setAttributeIfValue(element, "src", originalAttributes["src"]);
        setAttributeIfValue(element, "srcset", originalAttributes["srcset"]);
        setAttributeIfValue(element, "sizes", originalAttributes["sizes"]);
    };

    /**
     * Устанавливает новые атрибуты из data-атрибутов (src, srcset, sizes)
     * @param {HTMLImageElement} element - Элемент <img> или <source>
     * @param {Object} settings - Настройки экземпляра
     */
    var setImageAttributes = function setImageAttributes(element, settings)
    {
        setAttributeIfValue(element, "sizes", getData(element, settings.data_sizes));
        setAttributeIfValue(element, "srcset", getData(element, settings.data_srcset));
        setAttributeIfValue(element, "src", getData(element, settings.data_src));
    };

    /**
     * Сбрасывает атрибуты изображения (удаляет src, srcset, sizes)
     * Используется при отмене загрузки
     * @param {HTMLImageElement} element - Элемент <img> или <source>
     */
    var resetImageAttributes = function resetImageAttributes(element)
    {
        resetAttribute(element, "src");
        resetAttribute(element, "srcset");
        resetAttribute(element, "sizes");
    };

    /**
     * Выполняет функцию-коллбек для каждого тега <source> внутри элемента <picture>
     * Если родитель не <picture> - ничего не делает
     * @param {HTMLImageElement} element - Элемент <img>
     * @param {Function} fn - Функция, которая будет вызвана для каждого source-тега
     */
    var forEachPictureSource = function forEachPictureSource(element, fn)
    {
        var parent = element.parentNode;

        // Проверяем, что родитель это действительно <picture>
        if(!parent || parent.tagName !== "PICTURE")
        {
            return;
        }

        // Получаем все source-теги и применяем к ним функцию
        var sourceTags = getSourceTags(parent);
        sourceTags.forEach(fn);
    };

    /** ==================== РАБОТА С ВИДЕО (VIDEO) ==================== */

    /**
     * Выполняет функцию-коллбек для каждого тега <source> внутри видеоэлемента
     * @param {HTMLVideoElement} element - Элемент <video>
     * @param {Function} fn - Функция, которая будет вызвана для каждого source-тега
     */
    var forEachVideoSource = function forEachVideoSource(element, fn)
    {
        var sourceTags = getSourceTags(element);
        sourceTags.forEach(fn);
    };

    /**
     * Устанавливает источники видеоэлемента (source src и poster)
     * @param {HTMLVideoElement} element - Элемент <video>
     * @param {Object} settings - Настройки экземпляра
     */
    var setSourcesVideo = function setSourcesVideo(element, settings)
    {
        forEachVideoSource(element, function(sourceTag)
        {
            setAttributeIfValue(sourceTag, "src", getData(sourceTag, settings.data_src));
        });

        // Устанавливаем poster (превью) если есть
        setAttributeIfValue(element, "poster", getData(element, settings.data_poster));

        // Для видео также устанавливаем основной src
        setAttributeIfValue(element, "src", getData(element, settings.data_src));

        element.load(); // Перезагружаем видео с новыми источниками
    };

    /** ==================== РАБОТА С ИЗОБРАЖЕНИЯМИ (IMG) - ДЕЙСТВИЯ ==================== */

    /**
     * Восстанавливает оригинальные атрибуты для всех source-тегов внутри picture и самого img
     * @param {HTMLImageElement} element - Элемент <img>
     */
    var restoreOriginalAttributesImg = function restoreOriginalAttributesImg(element)
    {
        forEachPictureSource(element, function(sourceTag)
        {
            restoreOriginalImageAttributes(sourceTag);
        });

        restoreOriginalImageAttributes(element);
    };

    /**
     * Устанавливает новые атрибуты для picture и img элемента
     * Сохраняет оригинальные атрибуты перед изменением
     * @param {HTMLImageElement} element - Элемент <img>
     * @param {Object} settings - Настройки экземпляра
     */
    var setSourcesImg = function setSourcesImg(element, settings)
    {
        forEachPictureSource(element, function(sourceTag)
        {
            saveOriginalImageAttributes(sourceTag);
            setImageAttributes(sourceTag, settings);
        });

        saveOriginalImageAttributes(element);
        setImageAttributes(element, settings);
    };

    /**
     * Сбрасывает атрибуты всех source-тегов и img элемента
     * @param {HTMLImageElement} element - Элемент <img>
     */
    var resetSourcesImg = function resetSourcesImg(element)
    {
        forEachPictureSource(element, function(sourceTag)
        {
            resetImageAttributes(sourceTag);
        });

        resetImageAttributes(element);
    };

    /** ==================== РАБОТА С IFRAME ==================== */

    /**
     * Устанавливает src для iframe из data-атрибута
     * @param {HTMLIFrameElement} element - Элемент <iframe>
     * @param {Object} settings - Настройки экземпляра
     */
    var setSourcesIframe = function setSourcesIframe(element, settings)
    {
        setAttributeIfValue(element, "src", getData(element, settings.data_src));
    };

    /**
     * Объект-хранилище функций для установки источников в зависимости от тега элемента
     * Ключ - tagName, Значение - функция установки источников
     */
    var setSourcesFunctions = {
        IMG : setSourcesImg,
        IFRAME : setSourcesIframe,
        VIDEO : setSourcesVideo,
    };

    /** ==================== РАБОТА С ФОНОВЫМИ ИЗОБРАЖЕНИЯМИ ==================== */

    /**
     * Устанавливает фоновое изображение элемента
     * Поддерживает обычное и HiDPI версии
     * @param {HTMLElement} element - HTML-элемент (обычно div)
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var setBackground = function setBackground(element, settings, instance)
    {
        // Получаем URL обычного фонового изображения
        var bg1xValue = getData(element, settings.data_bg);

        // Получаем URL HiDPI фонового изображения если есть
        var bgHiDpiValue = getData(element, settings.data_bg_hidpi);

        // Выбираем правильную версию в зависимости от разрешения экрана
        var bgDataValue = isHiDpi && bgHiDpiValue ? bgHiDpiValue : bg1xValue;

        if(!bgDataValue)
        {
            return; // Если нет значения - выходим
        }

        // Устанавливаем фоновое изображение через style (используем temp image для отслеживания загрузки)
        element.style.backgroundImage = "url(\"".concat(bgDataValue, "\")");

        getTempImage(element).setAttribute("src", bgDataValue);

        manageLoading(element, settings, instance);
    };

    /**
     * Устанавливает множественные фоновые изображения (CSS background-image с несколькими url()
     * НЕ поддерживает temp image трюк, так как значения могут содержать градиенты и другие CSS-функции
     * @param {HTMLElement} element - HTML-элемент
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var setMultiBackground = function setMultiBackground(element, settings, instance)
    {
        var bg1xValue = getData(element, settings.data_bg_multi);
        var bgHiDpiValue = getData(element, settings.data_bg_multi_hidpi);

        var bgDataValue = isHiDpi && bgHiDpiValue ? bgHiDpiValue : bg1xValue;

        if(!bgDataValue)
        {
            return;
        }

        // Для множественных фонов устанавливаем непосредственно значение CSS
        element.style.backgroundImage = bgDataValue;

        manageApplied(element, settings, instance);
    };

    /**
     * Устанавливает источники элемента (img, iframe или video) в зависимости от его tagName
     * @param {HTMLElement} element - HTML-элемент
     * @param {Object} settings - Настройки экземпляра
     */
    var setSources = function setSources(element, settings)
    {
        // Получаем функцию установки источников по тегу элемента
        var setSourcesFunction = setSourcesFunctions[element.tagName];

        if(!setSourcesFunction)
        {
            return; // Если тег не поддерживается - выходим
        }

        setSourcesFunction(element, settings);
    };

    /**
     * Управляет состоянием "applied" (элемент вошел в поле зрения и настройки применены)
     * Добавляет класс applied, устанавливает статус и вызывает callback
     * Если включена опция unobserve_completed - снимает наблюдение сразу
     * @param {HTMLElement} element - HTML-элемент
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var manageApplied = function manageApplied(element, settings, instance)
    {
        addClass(element, settings.class_applied);
        setStatus(element, statusApplied);

        // Если опция включена - снимаем наблюдение сразу, а не при загрузке
        if(settings.unobserve_completed)
        {
            unobserve(element, settings);
        }

        safeCallback(settings.callback_applied, element, instance);
    };

    /**
     * Вспомогательная функция для загрузки скриптов и стилей (SCRIPT и LINK теги)
     * Создает новый элемент и вставляет его в head с сохранением всех атрибутов
     * @param {HTMLElement} element - Исходный SCRIPT или LINK элемент
     */
    let invokeScript = function scriptLoading(element)
    {
        let elem = null;

        // Если это <link> - создаем новый link и копируем href
        if(element.tagName === "LINK")
        {
            elem = document.createElement("LINK");
            elem.setAttribute("href", element.dataset.href);
        }

        // Если это <script> - создаем новый script
        if(element.tagName === "SCRIPT")
        {
            elem = document.createElement("SCRIPT");

            // Копируем src если он есть, иначе копируем текст скрипта
            if(typeof element.dataset.src === "string")
            {
                elem.setAttribute("src", element.dataset.src);
            }
            else
            {
                /** Присваиваем скрипт из тега (встроенный JS) */
                elem.text = element.text;
            }
        }

        // Если элемент был создан - копируем все остальные атрибуты
        if(elem)
        {
            // Переопределяем атрибуты, исключая data-src, data-href и class
            if(element instanceof Element && typeof element.getAttributeNames == "function")
            {
                element.getAttributeNames().forEach((function(e)
                {
                    // Исключаем служебные атрибуты, но сохраняем nonce для безопасности
                    if(e != "data-src" && e != "data-href" && e != "class")
                    {
                        if(e == "data-nonce")
                        {
                            elem.setAttribute("nonce", element.getAttribute(e));
                        }
                        else
                        {
                            elem.setAttribute(e.toString(), element.getAttribute(e));
                        }
                    }
                }));
            }

            // Удаляем исходный элемент из DOM
            element.remove();

            // Добавляем обработчик load если callback передан (не используется в текущей версии)
            if(typeof callback == "function")
            {
                elem.addEventListener("load", callback);
            }

            // Задержка перед вставкой (для стабильности)
            setTimeout(function()
            {
                document.head.appendChild(elem);
            }, 100);
        }
    };

    /**
     * Управляет состоянием "loading" (начало загрузки элемента)
     * Добавляет класс loading, устанавливает статус и вызывает callback
     * Удаляет data-атрибуты из DOM (чтобы они не мешали отладке)
     * @param {HTMLElement} element - HTML-элемент
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var manageLoading = function manageLoading(element, settings, instance)
    {
        updateLoadingCount(instance, +1); // Увеличиваем счетчик загружаемых элементов
        
        addClass(element, settings.class_loading);
        setStatus(element, statusLoading);

        safeCallback(settings.callback_loading, element, instance);

        // Удаляем data-атрибуты из DOM (они уже скопированы во внутренние свойства)
        element.removeAttribute("data-" + settings.data_bg);
        element.removeAttribute("data-" + settings.data_bg_hidpi);
        element.removeAttribute("data-" + settings.data_src);
    };

    /**
     * Массив тегов, которые поддерживают событие load (IMG, IFRAME, VIDEO)
     */
    var elementsWithLoadEvent = ["IMG", "IFRAME", "VIDEO"];

    /**
     * Проверяет, поддерживает ли элемент событие load
     * @param {HTMLElement} element - HTML-элемент
     * @returns {boolean}
     */
    var hasLoadEvent = function hasLoadEvent(element)
    {
        return elementsWithLoadEvent.indexOf(element.tagName) > -1;
    };

    /**
     * Проверяет, завершена ли загрузка всех элементов (loadingCount === 0 и toLoadCount === 0)
     * Если да - вызывает callback_finish
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var checkFinish = function checkFinish(settings, instance)
    {
        if(instance && !isSomethingLoading(instance) && !haveElementsToLoad(instance))
        {
            safeCallback(settings.callback_finish, instance);
        }
    };

    /**
     * Добавляет обработчик события с сохранением ссылки в объект llEvLisnrs
     * Это нужно для последующего удаления всех обработчиков при уничтожении экземпляра
     * @param {HTMLElement} element - HTML-элемент
     * @param {string} eventName - Имя события (load, error и т.д.)
     * @param {Function} handler - Функция-обработчик
     */
    var addEventListener = function addEventListener(element, eventName, handler)
    {
        element.addEventListener(eventName, handler);

        // Сохраняем ссылку на обработчик для последующего удаления
        element.llEvLisnrs[eventName] = handler;
    };

    /**
     * Удаляет обработчик события по сохраненной ссылке
     * @param {HTMLElement} element - HTML-элемент
     * @param {string} eventName - Имя события
     * @param {Function} handler - Функция-обработчик
     */
    var removeEventListener = function removeEventListener(element, eventName, handler)
    {
        element.removeEventListener(eventName, handler);
    };

    /**
     * Проверяет, есть ли у элемента сохраненные обработчики событий
     * @param {HTMLElement} element - HTML-элемент
     * @returns {boolean}
     */
    var hasEventListeners = function hasEventListeners(element)
    {
        return !!element.llEvLisnrs;
    };

    /**
     * Добавляет обработчики load и error для элемента
     * Для VIDEO используется событие loadeddata вместо load (более надежное)
     * @param {HTMLElement} element - HTML-элемент
     * @param {Function} loadHandler - Обработчик завершения загрузки
     * @param {Function} errorHandler - Обработчик ошибки загрузки
     */
    var addEventListeners = function addEventListeners(element, loadHandler, errorHandler)
    {
        if(!hasEventListeners(element))
        {
            element.llEvLisnrs = {}; // Инициализируем объект для хранения обработчиков
        }

        // Для видео используем loadeddata вместо load
        var loadEventName = element.tagName === "VIDEO" ? "loadeddata" : "load";

        addEventListener(element, loadEventName, loadHandler);
        addEventListener(element, "error", errorHandler);
    };

    /**
     * Удаляет все обработчики событий у элемента и очищает объект llEvLisnrs
     * @param {HTMLElement} element - HTML-элемент
     */
    var removeEventListeners = function removeEventListeners(element)
    {
        if(!hasEventListeners(element))
        {
            return;
        }

        var eventListeners = element.llEvLisnrs;

        // Проходим по всем сохраненным обработчикам и удаляем их
        for(var eventName in eventListeners)
        {
            var handler = eventListeners[eventName];
            removeEventListener(element, eventName, handler);
        }

        delete element.llEvLisnrs;
    };

    /**
     * Функция завершения загрузки элемента
     * Удаляет temp image, уменьшает счетчики, убирает класс loading
     * При необходимости снимает наблюдение за элементом
     * @param {HTMLElement} element - HTML-элемент
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var doneHandler = function doneHandler(element, settings, instance)
    {
        deleteTempImage(element);
        updateLoadingCount(instance, -1); // Уменьшаем счетчик загружаемых элементов
        decreaseToLoadCount(instance);    // Уменьшаем счетчик оставшихся к загрузке
        
        removeClass(element, settings.class_loading);

        if(settings.unobserve_completed)
        {
            unobserve(element, instance);
        }
    };

    /**
     * Обработчик успешного завершения загрузки элемента
     * Вызывает doneHandler, добавляет класс loaded, устанавливает статус
     * @param {Event} event - Событие load
     * @param {HTMLElement} element - Загруженный элемент
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var loadHandler = function loadHandler(event, element, settings, instance)
    {
        var goingNative = hasStatusNative(element);

        doneHandler(element, settings, instance);

        addClass(element, settings.class_loaded);
        setStatus(element, statusLoaded);
        safeCallback(settings.callback_loaded, element, instance);

        // Если использовался нативный режим - не вызываем checkFinish (счетчики не работают корректно)
        if(!goingNative)
        {
            checkFinish(settings, instance);
        }
    };

    /**
     * Обработчик ошибки загрузки элемента
     * Вызывает doneHandler, добавляет класс error, устанавливает статус
     * @param {Event} event - Событие error
     * @param {HTMLElement} element - Элемент с ошибкой
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var errorHandler = function errorHandler(event, element, settings, instance)
    {
        var goingNative = hasStatusNative(element);

        doneHandler(element, settings, instance);

        addClass(element, settings.class_error);
        setStatus(element, statusError);
        safeCallback(settings.callback_error, element, instance);

        if(!goingNative)
        {
            checkFinish(settings, instance);
        }
    };

    /**
     * Добавляет одноразовые обработчики событий для элемента (load и error)
     * Используется временный элемент при фоновой загрузке
     * @param {HTMLElement} element - HTML-элемент
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var addOneShotEventListeners = function addOneShotEventListeners(element, settings, instance)
    {
        // Используем temp image для фоновых изображений, иначе сам элемент
        var elementToListenTo = getTempImage(element) || element;

        if(hasEventListeners(elementToListenTo))
        {
            return; // Если обработчики уже есть (повторная попытка загрузки)
        }

        // Создаем замыкания для load и error обработчиков
        var _loadHandler = function _loadHandler(event)
        {
            loadHandler(event, element, settings, instance);
            removeEventListeners(elementToListenTo); // Удаляем обработчики после первого срабатывания
        };

        var _errorHandler = function _errorHandler(event)
        {
            errorHandler(event, element, settings, instance);
            removeEventListeners(elementToListenTo);
        };

        addEventListeners(elementToListenTo, _loadHandler, _errorHandler);
    };

    /**
     * Загружает фоновое изображение (background-image)
     * Создает temp image для отслеживания загрузки
     * @param {HTMLElement} element - HTML-элемент с background-image
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var loadBackground = function loadBackground(element, settings, instance)
    {
        addTempImage(element);
        addOneShotEventListeners(element, settings, instance);

        setBackground(element, settings, instance);
        setMultiBackground(element, settings, instance);
    };

    /**
     * Загружает обычный элемент с поддержкой load-события (img, iframe, video)
     * @param {HTMLElement} element - HTML-элемент
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var loadRegular = function loadRegular(element, settings, instance)
    {
        addOneShotEventListeners(element, settings, instance);

        setSources(element, settings); // Устанавливаем источники (src, srcset и т.д.)

        manageLoading(element, settings, instance); // Управляем состоянием loading
    };

    /**
     * Основная функция загрузки элемента
     * Выбирает правильный метод загрузки в зависимости от типа элемента
     * @param {HTMLElement} element - HTML-элемент для загрузки
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var load = function load(element, settings, instance)
    {
        // Специальная обработка SCRIPT тегов (загружаются как отдельные скрипты)
        if(element.tagName === "SCRIPT")
        {
            let elem = document.createElement("SCRIPT");

            // Копируем src или встроенный текст
            if(typeof element.dataset.src === "string")
            {
                elem.setAttribute("src", element.dataset.src);
            }
            else
            {
                elem.text = element.text;
            }

            if(elem)
            {
                // Копируем все атрибуты (кроме служебных)
                if(element instanceof Element && typeof element.getAttributeNames == "function")
                {
                    element.getAttributeNames().forEach((function(e)
                    {
                        if(e != "data-src" && e != "data-href" && e != "class")
                        {
                            if(e == "data-nonce")
                            {
                                elem.setAttribute("nonce", element.getAttribute(e));
                            }
                            else
                            {
                                elem.setAttribute(e.toString(), element.getAttribute(e));
                            }
                        }
                    }));
                }

                element.remove(); // Удаляем исходный элемент

                // Добавляем обработчик load если callback передан (не используется в текущей версии)
                if(typeof callback == "function")
                {
                    elem.addEventListener("load", callback);
                }

                // Используем executeFunc для повторных попыток вставки
                executeFunc(function initScriptElement()
                {
                    document.head.appendChild(elem);
                    return true;
                });

                return;
            }
        }

        // Для элементов с load-событием используем loadRegular, иначе - фоновое изображение
        if(hasLoadEvent(element))
        {
            loadRegular(element, settings, instance);
        }
        else
        {
            loadBackground(element, settings, instance);
        }
    };

    /**
     * Загружает элемент с использованием нативной lazy-load поддержки браузера
     * Устанавливает src и отслеживает загрузку через event listeners
     * @param {HTMLElement} element - HTML-элемент (img, iframe)
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var loadNative = function loadNative(element, settings, instance)
    {
        addOneShotEventListeners(element, settings, instance);

        setSources(element, settings);

        setStatus(element, statusNative); // Устанавливаем статус native
    };

    /**
     * Отменяет загрузку элемента при выходе из поля зрения
     * Работает только для IMG элементов в статусе loading
     * @param {HTMLElement} element - HTML-элемент
     * @param {Object} entry - Объект IntersectionObserverEntry
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var cancelLoading = function cancelLoading(element, entry, settings, instance)
    {
        // Проверяем опцию отмены загрузки при выходе
        if(!settings.cancel_on_exit)
        {
            return;
        }

        // Отмена только для элементов в статусе loading
        if(!hasStatusLoading(element))
        {
            return;
        }

        // Работает только на изображениях (IMG)
        if(element.tagName !== "IMG")
        {
            return;
        }

        removeEventListeners(element);

        resetSourcesImg(element);       // Сбрасываем атрибуты
        restoreOriginalAttributesImg(element); // Восстанавливаем оригинальные атрибуты
        
        removeClass(element, settings.class_loading);
        updateLoadingCount(instance, -1);

        resetStatus(element);           // Сбрасываем статус
        safeCallback(settings.callback_cancel, element, entry, instance);
    };

    /**
     * Обработчик входа элемента в поле зрения (IntersectionObserver onEnter)
     * Устанавливает статус entered, добавляет классы и запускает загрузку
     * @param {HTMLElement} element - HTML-элемент
     * @param {Object} entry - Объект IntersectionObserverEntry
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var onEnter = function onEnter(element, entry, settings, instance)
    {
        setStatus(element, statusEntered);

        addClass(element, settings.class_entered);
        removeClass(element, settings.class_exited);

        unobserveEntered(element, settings, instance);

        safeCallback(settings.callback_enter, element, entry, instance);

        // Если элемент уже начал загружаться - выходим (предотвращаем повторную загрузку)
        if(hadStartedLoading(element))
        {
            return;
        }

        load(element, settings, instance); // Запускаем загрузку
    };

    /**
     * Обработчик выхода элемента из поля зрения (IntersectionObserver onExit)
     * Вызывает отмену загрузки если она была начата
     * @param {HTMLElement} element - HTML-элемент
     * @param {Object} entry - Объект IntersectionObserverEntry
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var onExit = function onExit(element, entry, settings, instance)
    {
        // Игнорируем первый проход (пустой статус) при инициализации
        if(hasEmptyStatus(element))
        {
            return;
        }

        addClass(element, settings.class_exited);

        cancelLoading(element, entry, settings, instance);

        safeCallback(settings.callback_exit, element, entry, instance);
    };

    /**
     * Массив тегов, которые поддерживают нативную lazy-load поддержку браузера
     */
    var tagsWithNativeLazy = ["IMG", "IFRAME", "SCRIPT"];

    /**
     * Проверяет, можно ли использовать нативную lazy-load поддержку браузера
     * @param {Object} settings - Настройки экземпляра
     * @returns {boolean}
     */
    var shouldUseNative = function shouldUseNative(settings)
    {
        return settings.use_native && "loading" in HTMLImageElement.prototype;
    };

    /**
     * Загружает все элементы с использованием нативной lazy-load поддержки
     * Устанавливает атрибут loading="lazy" и отслеживает загрузку
     * @param {Array<HTMLElement>} elements - Массив элементов для загрузки
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var loadAllNative = function loadAllNative(elements, settings, instance)
    {
        elements.forEach(function(element)
        {
            // Проверяем поддержку нативной lazy-load для тега элемента
            if(tagsWithNativeLazy.indexOf(element.tagName) === -1)
            {
                return;
            }

            element.setAttribute("loading", "lazy"); // Устанавливаем атрибут loading="lazy"
            
            loadNative(element, settings, instance);
        });

        setToLoadCount(instance, 0); // Сбрасываем счетчик (все элементы уже обработаны)
    };

    /**
     * Проверяет, пересекается ли элемент с областью видимости
     * @param {Object} entry - Объект IntersectionObserverEntry
     * @returns {boolean}
     */
    var isIntersecting = function isIntersecting(entry)
    {
        return entry.isIntersecting || entry.intersectionRatio > 0;
    };

    /**
     * Формирует настройки для IntersectionObserver из общих настроек экземпляра
     * @param {Object} settings - Настройки экземпляра
     * @returns {IntersectionObserverInit}
     */
    var getObserverSettings = function getObserverSettings(settings)
    {
        return {
            root : settings.container === document ? null : settings.container,
            rootMargin : settings.thresholds || settings.threshold + "px",
        };
    };

    /**
     * Обработчик событий IntersectionObserver
     * Вызывает invokeScript для скриптов и onEnter/onExit в зависимости от видимости
     * После обработки снимает блокировку модальных кнопок (для Bootstrap)
     * @param {Array<IntersectionObserverEntry>} entries - Массив записей о пересечении
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var intersectionHandler = function intersectionHandler(entries, settings, instance)
    {
        entries.forEach(function(entry)
        {
            // Вызываем invokeScript (для загрузки скриптов)
            invokeScript(entry.target);

            // В зависимости от видимости вызываем onEnter или onExit
            return isIntersecting(entry) ?
                onEnter(entry.target, entry, settings, instance) :
                onExit(entry.target, entry, settings, instance);
        });

        /**
         * Снимает блокировку модальных кнопок после загрузки элементов
         * Используется executeFunc для повторных попыток ( Bootstrap может быть еще не загружен)
         */
        executeFunc(function activeDisableButton()
        {
            // Проверяем наличие bootstrap глобального объекта
            if(typeof bootstrap !== "object")
            {
                return false;
            }

            document.querySelectorAll("[data-bs-toggle=\"modal\"]").forEach(function(el)
            {
                el.classList.remove("disabled");
            });

            return true;
        });
    };

    /**
     * Добавляет элементы для наблюдения через IntersectionObserver
     * @param {IntersectionObserver} observer - Экземпляр IntersectionObserver
     * @param {Array<HTMLElement>} elements - Массив элементов для отслеживания
     */
    var observeElements = function observeElements(observer, elements)
    {
        elements.forEach(function(element)
        {
            observer.observe(element);
        });
    };

    /**
     * Обновляет наблюдатель: сначала disconnect, затем заново добавляет все элементы
     * Используется при обновлении экземпляра (метод update)
     * @param {IntersectionObserver} observer - Экземпляр IntersectionObserver
     * @param {Array<HTMLElement>} elementsToObserve - Новый набор элементов для отслеживания
     */
    var updateObserver = function updateObserver(observer, elementsToObserve)
    {
        resetObserver(observer); // Отключаем старое наблюдение

        observeElements(observer, elementsToObserve); // Добавляем новые элементы
    };

    /**
     * Создает и настраивает IntersectionObserver для экземпляра LazyLoad
     * Не создается если:
     * - IntersectionObserver не поддерживается
     * - Включена опция use_native
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad (в него записывается _observer)
     */
    var setObserver = function setObserver(settings, instance)
    {
        // Если IntersectionObserver не поддерживается или используется native режим - выходим
        if(!supportsIntersectionObserver || shouldUseNative(settings))
        {
            return;
        }

        // Создаем новый экземпляр IntersectionObserver с обработчиком и настройками
        instance._observer = new IntersectionObserver(function(entries)
        {
            intersectionHandler(entries, settings, instance);
        }, getObserverSettings(settings));
    };

    /**
     * Преобразует NodeList или HTMLCollection в обычный массив
     * @param {NodeList|HTMLCollection} nodeSet - Набор узлов
     * @returns {Array<Node>} Массив DOM-элементов
     */
    var toArray = function toArray(nodeSet)
    {
        return Array.prototype.slice.call(nodeSet);
    };

    /**
     * Запрашивает элементы из контейнера по селектору настроек
     * @param {Object} settings - Настройки экземпляра
     * @returns {NodeList}
     */
    var queryElements = function queryElements(settings)
    {
        return settings.container.querySelectorAll(settings.elements_selector);
    };

    /**
     * Фильтрует массив элементов, оставляя только те, которые не были обработаны ранее
     * (имеют пустой статус ll-status === null)
     * @param {Array<HTMLElement>} elements - Массив элементов
     * @returns {Array<HTMLElement>}
     */
    var excludeManagedElements = function excludeManagedElements(elements)
    {
        return toArray(elements).filter(hasEmptyStatus);
    };

    /**
     * Проверяет, имеет ли элемент статус "error"
     * @param {HTMLElement} element - HTML-элемент
     * @returns {boolean}
     */
    var hasError = function hasError(element)
    {
        return hasStatusError(element);
    };

    /**
     * Фильтрует массив элементов, оставляя только элементы с ошибкой
     * @param {Array<HTMLElement>} elements - Массив элементов
     * @returns {Array<HTMLElement>}
     */
    var filterErrorElements = function filterErrorElements(elements)
    {
        return toArray(elements).filter(hasError);
    };

    /**
     * Получает массив элементов, которые нужно загрузить
     * Если параметр elements не передан - запрашивает все элементы по селектору
     * Исключает уже обработанные элементы
     * @param {Array<Node>|null} elements - Массив элементов для проверки (опционально)
     * @param {Object} settings - Настройки экземпляра
     * @returns {Array<HTMLElement>}
     */
    var getElementsToLoad = function getElementsToLoad(elements, settings)
    {
        return excludeManagedElements(elements || queryElements(settings));
    };

    /**
     * Повторно пытается загрузить элементы, которые ранее завершились ошибкой
     * Убирает класс error и сбрасывает статус перед обновлением
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var retryLazyLoad = function retryLazyLoad(settings, instance)
    {
        var errorElements = filterErrorElements(queryElements(settings));

        errorElements.forEach(function(element)
        {
            removeClass(element, settings.class_error);
            resetStatus(element); // Сбрасываем статус для повторной загрузки
        });

        instance.update(); // Обновляем экземпляр (повторная попытка)
    };

    /**
     * Устанавливает обработчик события "online" для автоматической повторной загрузки при восстановлении соединения
     * @param {Object} settings - Настройки экземпляра
     * @param {Object} instance - Экземпляр LazyLoad
     */
    var setOnlineCheck = function setOnlineCheck(settings, instance)
    {
        if(!runningOnBrowser)
        {
            return;
        }

        window.addEventListener("online", function()
        {
            retryLazyLoad(settings, instance);
        });
    };

    /**
     * Основной конструктор класса LazyLoad
     * Создает экземпляр с заданными настройками и запускает обновление (загрузку элементов)
     * @param {Object} customSettings - Пользовательские настройки для этого экземпляра
     * @param {Array<Node>|null} elements - Массив элементов для загрузки (опционально)
     */
    var LazyLoad = function LazyLoad(customSettings, elements)
    {
        var settings = getExtendedSettings(customSettings);

        this._settings = settings;
        this.loadingCount = 0; // Количество элементов в процессе загрузки
        this.toLoadCount = 0;  // Количество элементов, которые еще нужно загрузить

        setObserver(settings, this);     // Создаем IntersectionObserver
        setOnlineCheck(settings, this);  // Устанавливаем обработчик online события

        this.update(elements);           // Запускаем загрузку
    };

    /**
     * Прототип класса LazyLoad с методами экземпляра
     */
    LazyLoad.prototype = {

        /**
         * Обновляет состояние экземпляра: пересчитывает элементы и запускает загрузку
         * Выбирает стратегию загрузки в зависимости от:
         * - Поддержки IntersectionObserver
         * - Опции use_native
         * - Является ли среда ботом
         * @param {Array<Node>|null} givenNodeset - Массив элементов для обновления (опционально)
         */
        update : function update(givenNodeset)
        {
            var settings = this._settings;

            // Получаем массив элементов, которые нужно загрузить
            var elementsToLoad = getElementsToLoad(givenNodeset, settings);

            setToLoadCount(this, elementsToLoad.length); // Устанавливаем количество к загрузке

            // Если бот или IntersectionObserver не поддерживается - загружаем все сразу
            if(isRobot || !supportsIntersectionObserver)
            {
                this.loadAll(elementsToLoad);
                return;
            }

            // Если используется нативная lazy-load
            if(shouldUseNative(settings))
            {
                loadAllNative(elementsToLoad, settings, this);
                return;
            }

            // Используем IntersectionObserver для отслеживания видимости
            updateObserver(this._observer, elementsToLoad);
        },

        /**
         * Уничтожает экземпляр LazyLoad: отключает observer и удаляет все внутренние свойства
         * Очищает элементы (удаляет llOriginalAttrs) перед удалением свойств
         */
        destroy : function destroy()
        {
            // Отключаем IntersectionObserver
            if(this._observer)
            {
                this._observer.disconnect();
            }

            // Очищаем пользовательские атрибуты элементов (llOriginalAttrs)
            queryElements(this._settings).forEach(function(element)
            {
                delete element.llOriginalAttrs;
            });

            // Удаляем все внутренние свойства экземпляра
            delete this._observer;
            delete this._settings;
            delete this.loadingCount;
            delete this.toLoadCount;
        },

        /**
         * Загружает все указанные элементы немедленно (без отслеживания видимости)
         * Отменяет наблюдение за каждым элементом перед загрузкой
         * @param {Array<Node>|null} elements - Массив элементов для загрузки
         */
        loadAll : function loadAll(elements)
        {
            var _this = this;
            var settings = this._settings;

            getElementsToLoad(elements, settings).forEach(function(element)
            {
                unobserve(element, _this);  // Отменяем наблюдение (загружаем сразу)
                load(element, settings, _this); // Загружаем элемент
            });
        },
    };

    /**
     * Статический метод для загрузки одного конкретного элемента
     * @param {HTMLElement} element - HTML-элемент для загрузки
     * @param {Object} customSettings - Пользовательские настройки (опционально)
     */
    LazyLoad.load = function(element, customSettings)
    {
        var settings = getExtendedSettings(customSettings);

        // Если элемент уже загружен - выходим
        if(element.dataset.allStatus === settings.class_loaded)
        {
            return;
        }

        load(element, settings);
    };

    /**
     * Статический метод для сброса статуса элемента (возвращает его в начальное состояние)
     * @param {HTMLElement} element - HTML-элемент
     */
    LazyLoad.resetStatus = function(element)
    {
        resetStatus(element);
    };

    /**
     * Автоматическая инициализация экземпляров при загрузке скрипта
     * Если в window существует lazyLoadOptions - создаются экземпляры с этими настройками
     */
    if(runningOnBrowser)
    {
        autoInitialize(LazyLoad, window.lazyLoadOptions);
    }

    return LazyLoad;

})));

/**
 * Вспомогательная функция для перезагрузки ленивых элементов
 * Если передан element - обновляет только вложенные lazy-элементы,
 * иначе обновляет все элементы с классом lazy на странице
 * @param {HTMLElement|null} element - Контейнер для поиска (опционально)
 */
function reloadLazy(element = null)
{
    const selector = element ? element.querySelectorAll(".lazy") : document.querySelectorAll(".lazy");

    selector.forEach(e => window.LazyLoad.load(e));
}

/**
 * Функция выполняется повторно, пока не вернет TRUE
 * Использует экспоненциальную задержку между попытками (200ms -> 400ms -> 800ms и т.д.)
 * Ограничена максимальной задержкой в 10000мс (10 секунд)
 * @param {Function} func - Функция, которую нужно выполнить
 * @param {number} initialDelay - Начальная задержка в мс (по умолчанию 200)
 * @param {number} multiplier - Множитель задержки при каждой попытке (по умолчанию 2)
 * @param {number} limit - Максимальная задержка в мс (по уолчанию 10000)
 * @returns {Promise<boolean>}
 */
function executeFunc(func, initialDelay = 200, multiplier = 2, limit = 10000)
{
    return new Promise((resolve, reject) =>
    {
        let delay = initialDelay;

        const run = () =>
        {
            const result = func();

            if(delay > limit)
            {
                console.error("Ошибка при выполнении функции");
                console.log(func);
                resolve(true); // Принудительно разрешаем даже при ошибке
                return;
            }

            if(result === true)
            {
                resolve(true); // Функция вернула true - успех
                return;
            }

            setTimeout(run, delay); // Повторяем через текущую задержку

            delay *= multiplier; // Увеличиваем задержку для следующей попытки
        };

        run();
    });
}