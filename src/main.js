'use strict';

define(['./pictures', './review', './load', './resizer', './upload', ], function(picturesContainer, getPictureElement, load) {
  load('http://localhost:1506/api/pictures', 'getPictures');
  window.getPictures = function(data) {
    data.forEach(function(picture) {
      getPictureElement(picture, picturesContainer);
    });
  };
});
