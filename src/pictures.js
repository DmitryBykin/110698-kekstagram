'use strict';

(function() {
  var picturesContainer = document.querySelector('.pictures');
  var filtersForm = document.querySelector('form.filters');

  filtersForm.classList.add('hidden');

  define( function() {
    return picturesContainer;
  });

  filtersForm.classList.remove('hidden');

})();
