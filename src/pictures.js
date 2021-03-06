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
    var activeFilter = localStorage.getItem('active-filter') || 'filter-popular';
    // фильтры= filter-popular, filter-new, filter-discussed
    var filterElement = document.getElementById(activeFilter);
    filterElement.checked = true;

    var showPictures = function(data) {
      data.forEach(function(picture) {
        var curPicture = new Picture(data, getPictureElement(picture), gallery);
        curPicture.addPicture(picturesContainer); // добавляем фотографию на страницу
        picturesData.push(picture);  // массив загруженных фотографий для галереи
      });
      gallery.setPictures(picturesData);
    };

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

    window.addEventListener('scroll', function() {
      throttle(function() {
        if (isBottomReached() &&
              isNextPageAvailable(picturesData, page, pageSize)) {
          page++;
          loadPictures();
        }
      }, window, 100);
    });

    var throttle = function(method, scope, delay) {
      delay = delay || 100;
      clearTimeout(method._tId);
      method._tId = setTimeout(function() {
        method.call(scope);
      }, delay);
    };

    picturesContainer.addEventListener('click', function(evt) { // показ галереи
      evt.preventDefault();
      if(evt.target.parentElement.classList.contains('picture')) {
        picturesData.forEach(function(picture, ind) {
          if(evt.target.src === evt.target.baseURI + picture.url) {
            gallery.show(ind);
          }
        });
      }
    });

    filtersForm.addEventListener('change', function() { // обработчик смены фильтра
      picturesContainer.innerHTML = '';
      picturesData = [];
      page = 0;
      activeFilter = 'filter-' + document.querySelector('.filters input[type=radio]:checked').value || 'popular';
      localStorage.setItem('active-filter', activeFilter);
      loadPictures(); // перерисовываем фотографии
    }, true);

  });

  filtersForm.classList.remove('hidden');

})();
