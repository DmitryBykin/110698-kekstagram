'use strict';

var inherit = function(Child, Base) {
  var EmptyConstructor = function() {};
  EmptyConstructor.prototype = Base.prototype;
  Child.prototype = new EmptyConstructor();    // используем пустой конструктор
};

define(['./base' ], function(Base) {
  var BaseElement = Base;

  var ChildElement = function(el) {
    BaseElement.call(this, el);
    this.element.addEventListener('scroll', this.onScroll); // добавляем новый обработчик
  };

  inherit(ChildElement, BaseElement);

  ChildElement.prototype.onClick = function() { // переопределяем onClick
    // click
  };
  ChildElement.prototype.onScroll = function() { // определяем onScroll
    // scroll
  };

  ChildElement.prototype.remove = function() {
    console.log('Удаляем у ' + this.element + ' добавленные обработчики в inherit.js');
    this.element.removeEventListener('scroll', this.onScroll); // очищаем onScroll
    BaseElement.prototype.remove.call(this);                   // onClick очистится в BaseElement
  };

  var element = 'div';
  var chElement = new ChildElement(element); // создаем элемент
  chElement.add();             // добавляем элемент на страницу
  chElement.remove();          // удаляем элемент вместе с обработчиками
});
