'use strict';

(function() {
  var IMAGE_LOAD_TIMEOUT = 10000;
  var elementToClone;
  var templateElement = document.querySelector('#picture-template');

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }

  define( function() {
    return function(data, container) {
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
  });
})();
