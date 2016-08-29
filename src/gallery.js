'use strict';


var picturesContainer = document.querySelector('.pictures');
var pictureElements;
var allPicturesEmpty = false;

var Gallery = function() {
  this.pictures = [];
  this.activePicture = 0;
  this.galleryOverlay = document.querySelector('.gallery-overlay');
  this.galleryOverlayClose = document.querySelector('.gallery-overlay-close');
  this.galleryOverlayImage = document.querySelector('.gallery-overlay-image');
  this.likesCount = document.querySelector('.likes-count');
  this.commentsCount = document.querySelector('.comments-count');
};

Gallery.prototype.setPictures = function(data) {
  pictureElements = picturesContainer.querySelectorAll('.picture');
  pictureElements = Array.prototype.slice.call(pictureElements);

// проверяем, все ли фотографии пустые
  allPicturesEmpty = pictureElements.every(function(element) {
    return element.classList.contains('picture-load-failure');
  });

  this.pictures = data;
};

Gallery.prototype.show = function(num) {
  var self = this;
  this.galleryOverlayClose.onclick = function() {
    self.hide();
  };
  this.galleryOverlay.onclick = function() {
    if(self.activePicture + 1 === self.pictures.length) {
      self.setActivePicture(0); // переходим на начало
    } else {
      self.setActivePicture(self.activePicture + 1); // переходим к следующей фотографии
    }
  };

  this.galleryOverlay.classList.remove('invisible');
  this.setActivePicture(num);
};

Gallery.prototype.hide = function() {
  this.galleryOverlay.classList.add('invisible');
  this.galleryOverlayClose.click = null;
  this.galleryOverlay.click = null;
  this.galleryOverlayImage.src = '';
};

Gallery.prototype.setActivePicture = function(num) {
  if(allPicturesEmpty) { // если все фотографии пустые показывать нечего
    return 0;
  } else {
    while(pictureElements[num].classList.contains('picture-load-failure')) { // пропускаем "пустые" фотографии
      num++;
      if(num === this.pictures.length) { // начинаем перебирать с начала
        num = 0;
      }
    }
  }

  this.activePicture = num;
  this.galleryOverlayImage.src = this.pictures[this.activePicture].url;
  this.likesCount.innerHTML = this.pictures[this.activePicture].likes;
  this.commentsCount.innerHTML = this.pictures[this.activePicture].comments;
  return num;
};

define(function() {
  return new Gallery();
});
