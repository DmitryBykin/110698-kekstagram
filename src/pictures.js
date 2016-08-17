'use strict';

var getPictures = function(data) {
  console.log(data);
};

function addScript(src, callbackFunction) {
  var elem = document.createElement('script');
  elem.src = src;
  elem.src += '?callback=' + callbackFunction.name;
  document.body.appendChild(elem);
}
addScript('http://localhost:1506/api/pictures', getPictures );
