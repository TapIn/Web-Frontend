var DEBUG = true;

var config = {
    paths: {
        'flowplayer': 'flowplayer/flowplayer-3.2.10.min',
    },
    shim: {
        'flowplayer': {
            exports: 'flowplayer'
        },
        'documentcloud/underscore': {
            exports: '_'
        },
        'documentcloud/backbone': {
            deps: ['documentcloud/underscore', 'jquery'],
            exports: 'Backbone'
        },
    }
};
if (DEBUG) {
    config['urlArgs'] = 'noCache=' +  (new Date()).getTime();
}

require.config(config);

define([
       'jquery',
       'documentcloud/backbone',
       'tapin/frontend/controllers/map',
       'tapin/frontend/controllers/static'],
       function(JQuery, Backbone)
{


    JQuery(document).ready(function(){
        // Start backbone
        Backbone.history.start();
    });
})