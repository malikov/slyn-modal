"use strict";

var BaseController = require('slyn-core-base-list-controller');

var Controller = function(backboneView, model) {
    BaseController.call(this, backboneView, model);

    this.name = 'ModalController';
}

Controller.prototype = Object.create(BaseController.prototype);
Controller.prototype.constructor = Controller;

Controller.prototype.show = function(){
    return this.view.show();
}

Controller.prototype.close = function(){
    return this.view.close();
}


module.exports = Controller;
