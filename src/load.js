'use strict';

define(function() {
  return function(url, params, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function(evt) {
      var loadedData = JSON.parse(evt.target.response);
      callback(loadedData);
    };
    xhr.open('GET', url +
    '?from=' + (params.from || 0) +
    '&to=' + (params.to || Infinity) +
    '&filter=' + (params.filter || 'ALL'));
    xhr.send();
  };
}
);
