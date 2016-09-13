'use strict';

var BaseElement = function(el) {
  this.element = document.createElement(el);
  this.element.className = 'test-class';
  this.element.id = 'test-id';
  this.element.style.backgroundColor = 'red';
  this.element.innerHTML = 'Base Element Constructor!';
  this.element.addEventListener('click', this.onClick);
};

BaseElement.prototype.remove = function() {          // удаляем элемент
  this.element.removeEventListener('click', this.onClick);
  this.element.parentNode.removeChild(this.element);
};
BaseElement.prototype.add = function() {          // добавляем на страницу
  document.body.appendChild(this.element);
};
BaseElement.prototype.onClick = function() {      // обработчик onClick
  // click
};
define(function() {
  return BaseElement;
});
