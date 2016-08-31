'use strict';

(function() {


  var picturesContainer = document.querySelector('.pictures');
  var filtersForm = document.querySelector('form.filters');

  filtersForm.classList.add('hidden');

  define(['./review', './gallery', './picture'], function(getPictureElement, gallery, Picture) {
    window.getPictures = function(data) {
      var i = 0;
      data.forEach(function(picture) {
        var curPicture = new Picture(data, getPictureElement(picture), gallery, i);
        curPicture.addPicture(picturesContainer); // добавляем фотографию на страницу
        i++;
      });
      gallery.setPictures(data);
    };
  });

  filtersForm.classList.remove('hidden');

})();
