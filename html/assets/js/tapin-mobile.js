// Configure require.js
require.config({
    // Shim the following apps so we can use them in local scope
    shim: {
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

       // Handlebars is hardcoded to load into window scope.
       'handlebars',

       // Loading these classes loads the routers automatically, due to the
       // stupid way Backbone handles routers in the window scope.
       'tapin/frontend/controllers/mobile/user'],
       function(JQuery, Backbone, Async)
{
    JQuery(document).ready(function(){
        // Start backbone
        Backbone.history.start();
    });
})