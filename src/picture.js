'use strict';
(function() {

  define(function() {
    return function(gallery, picturesContainer) {
      var elements = picturesContainer.querySelectorAll('.picture');
      elements = Array.prototype.slice.call(elements); // делаем массив без этого не работало в Firefox под Linux
      elements.forEach(function(element, index) {
        element.onclick = function(evt) {
          evt.preventDefault();
          gallery.show(index);
          gallery.setActivePicture(index);
        };
      });
    };
  });

})();
