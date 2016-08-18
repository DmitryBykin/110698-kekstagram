'use strict';

(function() {
  var templateElement = document.querySelector('#picture-template');
  var picturesContainer = document.querySelector('.pictures');
  var IMAGE_LOAD_TIMEOUT = 10000;
  var elementToClone;

// pictures должны были получить от сервера, но в этом модуле при попытке
// достучаться до этой переменной - pictures is not defined

  var pictures = [ {
    'likes': 364,
    'comments': 2,
    'url': 'photos/16.jpg'
  }, {
    'likes': 115,
    'comments': 21,
    'url': 'photos/17.jpg'
  }, {
    'likes': 228,
    'comments': 29,
    'url': 'photos/18.jpg'
  }, {
    'likes': 53,
    'comments': 26,
    'url': 'photos/19.jpg'
  }, {
    'likes': 240,
    'comments': 46,
    'url': 'photos/20.jpg'
  }, {
    'likes': 290,
    'comments': 69,
    'url': 'photos/21.jpg'
  }, {
    'likes': 283,
    'comments': 33,
    'url': 'photos/22.jpg'
  }, {
    'likes': 344,
    'comments': 65,
    'url': 'photos/23.jpg'
  }, {
    'likes': 216,
    'comments': 27,
    'url': 'photos/24.jpg'
  }, {
    'likes': 241,
    'comments': 36,
    'url': 'photos/25.jpg'
  }, {
    'likes': 100,
    'comments': 11,
    'url': 'photos/26.mp4',
    'preview': 'photos/26.jpg'
  }];

  /*
  * функция, которая создает элемент script для запроса pictures и
  * определяет название callback функции для обработки данных
  */
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

    backgroundImage.onload = function(evt) {
      clearTimeout(backgroundLoadTimeout);
      element.querySelector('img').src = evt.target.src;
      element.querySelector('img').width = '182';
      element.querySelector('img').height = '182';
    };

    backgroundImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    backgroundImage.src = data.url;

    backgroundLoadTimeout = setTimeout(function() {
      element.querySelector('img').src = '';
      element.classList.add('picture-load-failure');
    }, IMAGE_LOAD_TIMEOUT);

    return element;
  };

  filtersForm.classList.remove('hidden');

  pictures.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });

})();
