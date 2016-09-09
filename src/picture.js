'use strict';
(function() {

  var Picture = function(data, element, gallery) {
    this.data = data;
    this.element = element;
    this.gallery = gallery;

    return this;
  };

  /*Picture.prototype.onElementClick = function(curPictureIndex) {
    this.gallery.show(curPictureIndex);
    this.gallery.setActivePicture(curPictureIndex);
  };*/

  Picture.prototype.remove = function() {
    this.element.onclick = null;
  };

  Picture.prototype.addPicture = function(container) {
    container.appendChild(this.element);
  };

  define(function() {
    return Picture;
  });

})();
