var q = require("q");
var _ = require("underscore");
var Binder = require('slyn-data-binder');
var Modal = require('./single-modal');


/*
    This needs to be updated  I don't like the repetition in certain places
*/
module.exports = function(options){
    var self = this;
    
    self.modals = options.modals;
    self.currentModalIndex = -1;
    self.currentModal = null;
    
    var _insertNextPrevControls = function(controller){
        controller.next = self.next.bind(self);
        controller.previous = self.previous.bind(self);
    };
    
    // gets the first modal in the stack
    self.init = function(){
        return self.next();
    };
    
    self.show = function(index){
        var i = index || 0;
        
        this.modalStack[i].show();
    };
    
    self.close = function(index){
        var i = index || 0;
        
        this.modalStack[i].close();
    };
    
    self.next = function(params){
        var deferred = q.defer();
        
        if(self.currentModalIndex == self.modals.length){
            throw new Error ("Can't load next modal");
        }
        
        if(self.currentModal != null){
            self.currentModal.close();
        }
                
       
        var modalConf = self.modals[self.currentModalIndex];
        var _params = _.extend(params, options.params);
            
        var config = _.extend({
            rootEl: options.rootEl,
            params: _params
        }, modalConf);
            
        self.currentModal = Modal(config);
        self.currentModal.loadController()
                     .then(function(con) {
                            _insertNextPrevControls(con);
                            Binder.applyBinding(con.view, con);
                            deferred.resolve(self.currentModalIndex);
                         })
                         .catch(function(error) {
                            console.log(error);
                            deferred.reject(error);
                         });
        
        
        return deferred.promise;
    };
            
    self.previous = function(params){
        var deferred = q.defer();
        
        if(self.currentViewIndex == 0){
            throw new Error ("Can't load previous modal");
        }
        
        if(self.currentModal != null){
            self.currentModal.close();
        }
                
        self.currentModalIndex--;
        var modalConf = self.modals[self.currentModalIndex];
        var _params = _.extend(params, options.params);
            
        var config = _.extend({
            rootEl: options.rootEl,
            params: _params
        }, modalConf);
            
        self.currentModal = Modal(config);
        self.currentModal.loadController()
                     .then(function(con) {
                            _insertNextPrevControls(con);
                            Binder.applyBinding(con.view, con);
                            deferred.resolve(self.currentModalIndex);
                         })
                         .catch(function(error) {
                            console.log(error);
                            deferred.reject(error);
                         });
        
        
        return deferred.promise;
    };
    
    
    return self;
};