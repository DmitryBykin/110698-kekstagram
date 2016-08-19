'use strict';

(function() {
  var templateElement = document.querySelector('#picture-template');
  var picturesContainer = document.querySelector('.pictures');
  var IMAGE_LOAD_TIMEOUT = 10000;
  var elementToClone;
  /*
  * функция, которая создает элемент script для запроса pictures и
  * определяет название callback функции для обработки данных
  */
  window.getPictures = function(data) {
    data.forEach(function(picture) {
      getPictureElement(picture, picturesContainer);
    });
  };

  function addScript(url, callbackFunction) {
    var elem = document.createElement('script');
    elem.src = url + '/?callback=' + callbackFunction;
    document.body.appendChild(elem);
  }
 /*
 * запрос на сервер для получения массива pictures
 */
  addScript('http://localhost:1506/api/pictures', 'getPictures' );

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }

  var filtersForm = document.querySelector('form.filters');
  filtersForm.classList.add('hidden');

  var getPictureElement = function(data, container) {
    var element = elementToClone.cloneNode(true);
    container.appendChild(element);
    var backgroundLoadTimeout;
    var backgroundImage = new Image();
    var imgElement = element.querySelector('img');

    backgroundImage.onload = function(evt) {
      clearTimeout(backgroundLoadTimeout);
      imgElement.src = evt.target.src;
      imgElement.width = '182';
      imgElement.height = '182';
    };

    backgroundImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    backgroundImage.src = data.url;

    backgroundLoadTimeout = setTimeout(function() {
      imgElement.src = '';
      element.classList.add('picture-load-failure');
    }, IMAGE_LOAD_TIMEOUT);

    return element;
  };

  filtersForm.classList.remove('hidden');

})();
