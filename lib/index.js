var _ = require("underscore");
var q = require("q");
var $ = require("jquery");
var Binder = require('slyn-data-binder');

module.exports.modal = function(configuration){
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
    }
    
    self.close = function(){
        controller.close();
    }
    
    self.init = function(){
        var deferred = q.defer();
        var promise = null;
        
        if(Object.hasOwnProperty.call(configuration, 'infiniteList') && configuration.infiniteList){
            var itemTemplate = templateContext('./'+opts.itemTemplateUrl);
                
            promise = controller.load(opts.rootEl, template, itemTemplate, opts.params);
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
    }
    
    return self;
}

module.exports.view = require("./base-modal-view");
module.exports.controller = require("./base-modal-controller");
module.exports.listController = require("./base-modal-list-controller");
