require.config({
    shim: {
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
       'handlebars',
       'tapin/frontend/controllers/mobile/user'],
       function(JQuery, Backbone, Async)
{
    JQuery(document).ready(function(){
        // Start backbone
        Backbone.history.start();
    });
})