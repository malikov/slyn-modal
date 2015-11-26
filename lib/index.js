var _ = require("underscore");
var q = require("q");
var $ = require("jquery");
var Binder = require('slyn-data-binder');

module.exports.Modal = function(configuration){
    var self = this;
    
     // look for controllers folder in the root of the app excluding files in the node_modules folder
    var controllerContext = require.context("../../..", true, /^((?![\/|\\]node_modules[\/|\\]).)*([\/|\\]controllers[\/|\\])(\w|\-|\_|\\|\/)*(\-controller)\.js$/);

    // look for templates folder in the root of the app excluding files in node_modules folder
    var templateContext = require.context("../../..", true, /^((?![\/|\\]node_modules[\/|\\]).)*([\/|\\]templates[\/|\\])(\w|\-|\_|\\|\/)*(\-template)\.(dust|jade)$/);

    var root = $("<div>");
    if(configuration.params && configuration.params.modal && configuration.params.modal.fullscreen){
        root.addClass('modal fullscreen fade');
    }else{
        root.addClass('modal fade');
    }
    var opts = _.extend({
        rootEl: root,
        controller: "base-modal-controller",
        templateUrl: "base-modal-template", 
        itemTemplateUrl: null,
        params: null
    }, configuration);
    
    var controller = controllerContext("./"+opts.controller);
    var template = templateContext("./"+opts.templateUrl);
    
    
    
    self.show = function(){
        controller.show(opts.modal,opts.params);    
    };
    
    self.close = function(){
        controller.close();
    };
    
    self.init = function(){
        var deferred = q.defer();
        var promise = null;
        
        if(Object.hasOwnProperty.call(configuration, 'infiniteList') && configuration.infiniteList){
            var itemTemplate = templateContext('./'+opts.itemTemplateUrl);
                
            promise = controller.load(opts.rootEl, template, itemTemplate, opts.params);
        }if(Object.hasOwnProperty.call(configuration, 'stack') && configuration.stack){
            self.views = configuration.views;
            self.currentViewIndex = 0;
            
            self.next = function(params){
                if(self.views.length < 2 || self.currentViewIndex == self.views.length){
                    return;
                }
                
                self.currentViewIndex++;
                var viewConf = self.views[self.currentViewIndex];
                
                return _loadController(viewConf, params);
            };
            
            self.previous = function(params){
                if(self.views.length < 2 || self.currentViewIndex == 0){
                    return;
                }
                
                self.currentViewIndex--;
                var viewConf = self.views[self.currentViewIndex];
                
                return _loadController(viewConf, params);
            };
            
            var _loadController = function(conf, params){
                var _controller = controllerContext("./"+conf.controller);
                var _template = templateContext("./"+conf.templateUrl);
                    
                if(Object.hasOwnProperty.call(conf, 'infiniteList') && configuration.infiniteList){
                    var _itemTemplate = templateContext('./'+conf.itemTemplateUrl);
                        
                    promise = _controller.load(opts.rootEl, _template, _itemTemplate, params);
                }else{
                    promise = _controller.load(opts.rootEl, _template, params);
                }
                
                return promise;
            };
            
            promise = self.next(opts.params);
        }else{
            promise = controller.load(opts.rootEl, template, opts.params);
        }
        
        promise.then(function(con) {
                Binder.applyBinding(con.view, con);
                deferred.resolve(con);
            })
            .catch(function(error) {
                console.log(error);
                deferred.reject(error);
            });
        
        return deferred.promise;
    };
    
    return self;
};

module.exports.View = require("./base-modal-view");
module.exports.Controller = require("./base-modal-controller");
module.exports.ListController = require("./base-modal-list-controller");
