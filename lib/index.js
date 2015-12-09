var _ = require("underscore");
var q = require("q");
var $ = require("jquery");
var SingleModal = require("./modals/single-modal");
var ListModal = require("./modals/list-modal");

module.exports.Modal = function(type, configuration){
    var root = $("<div>");
    
    if(configuration.params.modal && configuration.params.modal.fullscreen){
        root.addClass('modal fullscreen fade');
    }else{
        root.addClass('modal fade');
    }
    
    var opts = _.extend({
        rootEl: root,
        params: null
    }, configuration);
    
    if(type === 'list')
        return ListModal(opts);
        
    return SingleModal(opts);
};

module.exports.View = require("./base-modal-view");
module.exports.Controller = require("./base-modal-controller");
module.exports.ListController = require("./base-modal-list-controller");
