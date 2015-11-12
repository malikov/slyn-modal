"use strict";

/*
* This module depends on bootstrap
*
*/
var BackboneDustView = require("slyn-core-dust-base-view");
var BackboneDustListView = require("slyn-core-dust-base-list-view");
var ToastrView = require("slyn-toastr");

var q = require("q");
var $ = require("jquery");
var _ = require("underscore");

var ToastrView = require('slyn-toastr')();

module.exports = function(type){
    var BaseView = null;
    
    if(type === 'list'){
        BaseView = BackboneDustListView;
    }else{
        BaseView = BackboneDustView;
    }
    
    return BaseView.extend({
        name: 'ModalView',
        toastr: null,
        initialize: function(options) {
            BaseView.prototype.initialize.call(this, options);
            
            this.modal = null;
            this.toastr = new ToastrView();
            
            _.bindAll(this, 'show','hide', 'removeModal');
        },
        render: function(options) {
            var deferred = q.defer();
            
            var opt = $.extend({
            }, options);
    
            BaseView.prototype.render.call(this, opt).then(function(output){
                // once the template has been rendered use bootstrap modal function to turn it into a modal
                $(this.$el).modal(this.params.modal || {});
                deferred.resolve(output);
            }.bind(this)).catch(function(error){
                console.log(error);
                deferred.reject(error);       
            }.bind(this));
            
            return deferred.promise;
        },
        show: function(){
            $(this.$el).modal('show');
        },
        hide: function(){
            $(this.$el).modal('hide');
            this.removeModal();
        },
        removeModal: function(){
            console.log('removing modal...');
            this.$el.remove();
        }
    });
}