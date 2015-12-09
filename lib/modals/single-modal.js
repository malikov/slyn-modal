var q = require("q");
var Binder = require('slyn-data-binder');

// look for controllers folder in the root of the app excluding files in the node_modules folder
var controllerContext = require.context("../../../..", true, /^((?![\/|\\]node_modules[\/|\\]).)*([\/|\\]controllers[\/|\\])(\w|\-|\_|\\|\/)*(\-controller)\.js$/);

// look for templates folder in the root of the app excluding files in node_modules folder
var templateContext = require.context("../../../..", true, /^((?![\/|\\]node_modules[\/|\\]).)*([\/|\\]templates[\/|\\])(\w|\-|\_|\\|\/)*(\-template)\.(dust|jade)$/);

module.exports = function(options){
    var self = this;
    
    var controller = (!options.controller)? require("../base-modal-controller") : controllerContext("./"+options.controller);
    
    var template = (!options.templateUrl)? require("../templates/base-modal-template.dust") : templateContext('./'+options.templateUrl);
    
    var itemTemplate = (options.itemTemplateUrl)? templateContext('./'+options.itemTemplateUrl) : null;
    
    self.init = function(){
        var deferred = q.defer();
        
        self.loadController().then(function(con) {
                Binder.applyBinding(con.view, con);
                deferred.resolve(con);
            })
            .catch(function(error) {
                console.log(error);
                deferred.reject(error);
            });
        
        return deferred.promise;
    };
    
    self.loadController = function(){
        var promise = null;
        
        if(Object.hasOwnProperty.call(options, 'infiniteList') && options.infiniteList){
            promise = controller.load(options.rootEl, template, itemTemplate, options.params);
        }else{
            promise = controller.load(options.rootEl, template, options.params);
        }
        
        return promise;
    }
    
    self.show = function(){
        controller.show();
    };
    
    self.close = function(){
        controller.close();
    };
    
    return self;
};