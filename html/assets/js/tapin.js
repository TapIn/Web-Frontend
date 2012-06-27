// Configure require.js
require.config({
    paths: {
        // flowplayer should reference the latest version we have loaded
        'flowplayer': 'flowplayer/flowplayer-3.2.10.min',
    },
    // Shim the following apps so we can use them in local scope
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
    // Prevent caching (this should probably be disabled in production!)
    urlArgs: 'noCache=' + (new Date()).getTime()
});

// Initializes the app
define([
       'jquery',
       'documentcloud/backbone',
       'tapin/util/async',

       // Mixpanel is hardcoded to load into window scope.
       'mixpanel',

       // Handlebars is hardcoded to load into window scope.
       'handlebars',

       // Loading these classes loads the routers automatically, due to the
       // stupid way Backbone handles routers in the window scope.
       'tapin/frontend/controllers/map',
       'tapin/frontend/controllers/video',
       'tapin/frontend/controllers/static',
       'tapin/frontend/controllers/user'],
       function(JQuery, Backbone, Async)
{
    JQuery(document).ready(function(){
        // Start backbone
        Backbone.history.start();
    });
})