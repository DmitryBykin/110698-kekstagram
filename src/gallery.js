'use strict';

var picturesContainer = document.querySelector('.pictures');
var pictureElements;
var hasNotEmptyPicture = false;

var Gallery = function() {
  this.pictures = [];
  this.activePicture = 0;
  this.galleryOverlay = document.querySelector('.gallery-overlay');
  this.galleryOverlayClose = document.querySelector('.gallery-overlay-close');
  this.galleryOverlayImage = document.querySelector('.gallery-overlay-image');
  this.likesCount = document.querySelector('.likes-count');
  this.commentsCount = document.querySelector('.comments-count');
  this.elementConstructor = function(el) {
    this.onClick = this.onClick.bind(this);
    el.addEventListener('click', this.onClick);
  };
  this.elementConstructor(this.galleryOverlay);
};

Gallery.prototype.onClick = function(evt) {
  if(evt.target.classList.contains('gallery-overlay-close')) {
    this.hide();
  } else {
    if(evt.target.classList.contains('gallery-overlay-image')) {
      if(this.activePicture + 1 === this.pictures.length) {
        this.setActivePicture(0); // переходим на начало
      } else {
        this.setActivePicture(this.activePicture + 1); // переходим к следующей фотографии
      }
    }
  }
};

Gallery.prototype.setPictures = function(data) {
  pictureElements = picturesContainer.querySelectorAll('.picture');
  pictureElements = Array.prototype.slice.call(pictureElements);

  // проверяем, есть ли хотя бы одна не пустая фотография
  hasNotEmptyPicture = pictureElements.some(function(element) {
    return !element.classList.contains('picture-load-failure');
  });
  this.pictures = data;
};

Gallery.prototype.show = function(num) {
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
  if(hasNotEmptyPicture) { // если есть хотя бы одна непустая фотография while не уйдет в бесконечный цикл
    while(pictureElements[num].classList.contains('picture-load-failure')) { // пропускаем "пустые" фотографии
      num++;
      if(num === this.pictures.length) { // начинаем перебирать с начала
        num = 0;
      }
    }
  } else {
    return 0; // все фотографии пустые - показывать нечего
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
