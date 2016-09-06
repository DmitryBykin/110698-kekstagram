'use strict';

(function() {

  var picturesContainer = document.querySelector('.pictures');
  var filtersForm = document.querySelector('form.filters');
  var PICTURES_LOAD_URL = 'api/pictures';
  var pageSize = 12;
  var page = 0;
  var picturesData = [];
  var footerElement = document.querySelector('footer');

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

    var isBottomReached = function() {
      var GAP = 100;
      var footerPosition = footerElement.getBoundingClientRect();
      return footerPosition.top - window.innerHeight - 100 <= GAP;
    };

    var isNextPageAvailable = function(data, curPage, pagesize) {
      return page < Math.floor(data.length / pagesize);
    };

    var loadPictures = function() {
      do {  // заполняем фотографиями пока не дойдем до конца
        load(PICTURES_LOAD_URL, {
          from: page * pageSize,
          to: page * pageSize + pageSize,
          filter: activeFilter }, showPictures);
        if(!isNextPageAvailable(picturesData, page, pageSize)) {
          break;
        }
        page++;
        pageSize = 5; // уменьшаем размер страницы
      } while(!isBottomReached());
    };

    loadPictures();

    var scrollTimeout;

    window.addEventListener('scroll', function() {
      pageSize = 12;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        if (isBottomReached() &&
            isNextPageAvailable(picturesData, page, pageSize)) {
          page++;
          loadPictures();
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
      pageSize = 12;
      activeFilter = 'filter-' + document.querySelector('.filters input[type=radio]:checked').value || 'popular';
      loadPictures(); // перерисовываем фотографии
    }, true);
  });

  filtersForm.classList.remove('hidden');

})();
