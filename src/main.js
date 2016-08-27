'use strict';

define(['./pictures', './load', './resizer', './upload', ], function(pictures, load) {
  load('http://localhost:1506/api/pictures', 'getPictures');
});
