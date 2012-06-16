require.config({
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
    },
    urlArgs: 'noCache=' + (new Date()).getTime()
});

define([
       'jquery',
       'documentcloud/backbone',
       'tapin/util/async',
       'mixpanel',
       'tapin/frontend/controllers/map',
       'tapin/frontend/controllers/video',
       'tapin/frontend/controllers/static'],
       function(JQuery, Backbone, Async)
{


    JQuery(document).ready(function(){
        // Start backbone
        Backbone.history.start();
    });
})