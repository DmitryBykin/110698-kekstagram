'use strict';

module.exports = function(list, filterID) {
  switch(filterID) {

    case 'filter-popular':
      list.sort();
      break;

    case 'filter-new':
      list.sort(function(a, b) {
        return b.created - a.created;
      });
      var curDate = new Date();
      var lessThreeDays = [];
      list.forEach(function(item) {
        if( (curDate - item.created) / (1000 * 24 * 60 * 60) < 3) {
          lessThreeDays.push(item);
        } else {
          return; // т.к. список отсортирован по убыванию больше нужных элементов не встретится
        }         // выходим из forEach
      });
      list = lessThreeDays.slice(0);
      break;

    case 'filter-discussed' : list.sort(function(a, b) {
      return b.comments - a.comments;
    });
      break;
  }
  return list;
};
