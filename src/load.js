'use strict';

(function() {
  define(function() {
    return function(url, callbackFunction) {
      var elem = document.createElement('script');
      elem.src = url + '/?callback=' + callbackFunction;
      document.body.appendChild(elem);
    };
  });
})();
