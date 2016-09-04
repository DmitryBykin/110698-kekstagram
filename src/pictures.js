'use strict';

(function() {

  var picturesContainer = document.querySelector('.pictures');
  var filtersForm = document.querySelector('form.filters');
  var PICTURES_LOAD_URL = 'api/pictures';
  var PAGE_SIZE = 12;
  var page = 0;
  var picturesData = [];

  filtersForm.classList.add('hidden');

  define(['./review', './gallery', './picture', './load'], function(getPictureElement, gallery, Picture, load) {

    var showPictures = function(data) {
      data.forEach(function(picture) {
        var curPicture = new Picture(data, getPictureElement(picture), gallery);
        curPicture.addPicture(picturesContainer); // добавляем фотографию на страницу
        picturesData.push(picture);  // массив загруженных фотографий для галереи
      });
      gallery.setPictures(picturesData);
    };

    var activeFilter = 'filter-' + document.querySelector('.filters input[type=radio]:checked').value || 'popular';
    // фильтры= filter-popular, filter-new, filter-discussed

    load(PICTURES_LOAD_URL, {
      from: page * PAGE_SIZE,
      to: page * PAGE_SIZE + PAGE_SIZE,
      filter: activeFilter }, showPictures);

    var isBottomReached = function() {
      var GAP = 100;
      var footerElement = document.querySelector('footer');
      var footerPosition = footerElement.getBoundingClientRect();
      return footerPosition.top - window.innerHeight - 100 <= GAP;
    };

    var isNextPageAvailable = function(data, curPage, pageSize) {
      return page < Math.floor(data.length / pageSize);
    };

    var scrollTimeout;

    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        if (isBottomReached() &&
            isNextPageAvailable(picturesData, page, PAGE_SIZE)) {
          page++;
          console.log(page);
          load(PICTURES_LOAD_URL, {
            from: page * PAGE_SIZE,
            to: page * PAGE_SIZE + PAGE_SIZE,
            filter: activeFilter }, showPictures);
        }
      }, 100);
    });

    picturesContainer.addEventListener('click', function(evt) { // показ галереи
      evt.preventDefault();
      if(evt.target.parentElement.classList.contains('picture')) {
        picturesData.forEach(function(picture, ind) {
          if(evt.target.src === evt.target.baseURI + picture.url) {
            gallery.show(ind);
            gallery.setActivePicture(ind);
          }
        });
      }
    });

    filtersForm.addEventListener('change', function() { // обработчик смены фильтра
      picturesContainer.innerHTML = '';
      picturesData = [];
      page = 0;
      activeFilter = 'filter-' + document.querySelector('.filters input[type=radio]:checked').value || 'popular';
      load(PICTURES_LOAD_URL, {
        from: page * PAGE_SIZE,
        to: page * PAGE_SIZE + PAGE_SIZE,
        filter: activeFilter }, showPictures);
    }, true);
  });

  filtersForm.classList.remove('hidden');

})();
