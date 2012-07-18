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

       // hardcoded to load into window scope.
       'mixpanel',
       'handlebars',
       'datepicker/datepicker',
       'fancybox/jquery.fancybox-1.3.4',
       'timeago',
       'bootstrap/carousel',
       'bootstrap/bootstrap.min',

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
    window['$'] = JQuery;
    window['jQuery'] = JQuery;
})