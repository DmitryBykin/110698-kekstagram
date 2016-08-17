'use strict';

(function() {

  function addScript(url, callbackFunction) {
    var elem = document.createElement('script');

    elem.src = url + '/?callback=' + callbackFunction;

    document.body.appendChild(elem);
  }

  addScript('http://localhost:1506/api/pictures', 'getPictures' );

})();
