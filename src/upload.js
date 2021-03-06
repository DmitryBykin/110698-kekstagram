/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

(function() {
  /** @enum {string} */
  var browserCookies = require('browser-cookies');

  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  function resizeFormIsValid() {
    return true;
  }

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.onchange = function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.onload = function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();

          addFormCheckListeners();
        };

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если формат загружаемого файла не поддерживается
        showMessage(Action.ERROR);
      }
    }
  };

  /**
   * Вешаем на поля формы вызов функции проверки
   */
  function addFormCheckListeners() {
    var xField = resizeForm.elements.x;
    var yField = resizeForm.elements.y;
    var sideField = resizeForm.elements.size;
    var button = resizeForm.elements.fwd;

    xField.addEventListener('input', function() {
      // сразу при вводе проверяем критерии
      checkFormFields(xField, yField, sideField, button);
      currentResizer.setConstraint(parseInt(xField.value, 10), parseInt(yField.value, 10), parseInt(sideField.value, 10));
    });
    xField.addEventListener('change', function() {
      checkFormFieldsMinValues(xField, yField, sideField);
      // если были установлены новые значения в поля проверяем критерии еще раз
      checkFormFields(xField, yField, sideField, button);
      currentResizer.setConstraint(parseInt(xField.value, 10), parseInt(yField.value, 10), parseInt(sideField.value, 10));
    });

    yField.addEventListener('input', function() {
      checkFormFields(xField, yField, sideField, button);
      currentResizer.setConstraint(parseInt(xField.value, 10), parseInt(yField.value, 10), parseInt(sideField.value, 10));
    });
    yField.addEventListener('change', function() {
      checkFormFieldsMinValues(xField, yField, sideField);
      checkFormFields(xField, yField, sideField, button);
      currentResizer.setConstraint(parseInt(xField.value, 10), parseInt(yField.value, 10), parseInt(sideField.value, 10));
    });

    sideField.addEventListener('input', function() {
      checkFormFields(xField, yField, sideField, button);
      currentResizer.setConstraint(parseInt(xField.value, 10), parseInt(yField.value, 10), parseInt(sideField.value, 10));
    });
    sideField.addEventListener('change', function() {
      checkFormFieldsMinValues(xField, yField, sideField);
      checkFormFields(xField, yField, sideField, button);
      currentResizer.setConstraint(parseInt(xField.value, 10), parseInt(yField.value, 10), parseInt(sideField.value, 10));
    });

  }
  /**
   * Функция проверки полей
   *
   */
  var checkFormFields = function(xField, yField, sideField, button) {
    if (parseInt(xField.value, 10) + parseInt(sideField.value, 10) > currentResizer._image.naturalWidth ||
        parseInt(yField.value, 10) + parseInt(sideField.value, 10) > currentResizer._image.naturalHeight ||
        !xField.value || !yField.value || !sideField.value) {
      button.disabled = true;
    } else {
      button.disabled = false;
    }
  };
  /*
  * Функция проверки и установки минимальных значений в поля если поля пустые или были введены
  * значения меньше минимальных
  */
  var checkFormFieldsMinValues = function(xField, yField, sideField) {
    if(parseInt(xField.value, 10) < parseInt(xField.min, 10) || !xField.value) {
      xField.value = xField.min;
    } else {
      if(parseInt(yField.value, 10) < parseInt(yField.min, 10) || !yField.value) {
        yField.value = yField.min;
      } else {
        if(parseInt(sideField.value, 10) < parseInt(sideField.min, 10) || !sideField.value) {
          sideField.value = sideField.min;
        }
      }
    }
  };

  window.addEventListener('resizerchange', function() {
    var curRes = currentResizer.getConstraint();
    var xField = resizeForm.elements.x;
    var yField = resizeForm.elements.y;
    var sideField = resizeForm.elements.size;
    var button = resizeForm.elements.fwd;

    xField.value = curRes.x;
    yField.value = curRes.y;
    sideField.value = curRes.side;

    checkFormFieldsMinValues(xField, yField, sideField);
    checkFormFields(xField, yField, sideField, button);
  });
  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.onreset = function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      var image = currentResizer.exportImage().src;

      var thumbnails = filterForm.querySelectorAll('.upload-filter-preview');
      for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].style.backgroundImage = 'url(' + image + ')';
      }

      filterImage.src = image;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');

      setFilterFromCookie();
    }
  };
  function setFilterFromCookie() {
    var filterName = browserCookies.get('upload-filter') || 'none';
    document.querySelector('#upload-filter-' + filterName).checked = true;
    filterImage.classList.add('filter-' + filterName);
  }
  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.onreset = function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  };

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.onsubmit = function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');

    saveFilterToCookie();
  };

  function saveFilterToCookie() {
    var element = document.querySelector('#upload-filter input[type=radio]:checked');
    browserCookies.set('upload-filter', element.value, {expires: getDaysToExpireCookie() });
  }
  function getDaysToExpireCookie() {
    var birthday = new Date(1906, 11, 9); // 9 декабря 1906 г.
    var curDate = new Date();
    var thisYearBirthday = new Date(curDate.getFullYear(), birthday.getMonth(), birthday.getDate());
    if (curDate > thisYearBirthday) {
      return (curDate - thisYearBirthday) / (1000 * 60 * 60 * 24); // день рождения в текущем году уже прошёл
    } else {
      // создаем дату дня рождения в прошлом году
      var lastYearBirthday = new Date( curDate.getFullYear() - 1, birthday.getMonth(), birthday.getDate());
      return Math.ceil( (curDate - lastYearBirthday) / (1000 * 60 * 60 * 24) ); // значение в днях
    }
  }
  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.onchange = function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia',
        'marvin': 'filter-marvin'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  };

  cleanupResizer();
  updateBackground();
})();
