'use strict';

(function() {


  var picturesContainer = document.querySelector('.pictures');
  var filtersForm = document.querySelector('form.filters');

  filtersForm.classList.add('hidden');

  define(['./review', './gallery', './picture'], function(getPictureElement, gallery, addPicturesListener) {
    window.getPictures = function(data) {
      data.forEach(function(picture) {
        getPictureElement(picture, picturesContainer);
      });
      gallery.setPictures(data);
      addPicturesListener(gallery, picturesContainer);
    };
  });

  filtersForm.classList.remove('hidden');

})();
