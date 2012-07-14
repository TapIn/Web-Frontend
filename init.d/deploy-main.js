({
    baseUrl: "../html/assets/js",
    name: 'tapin',
    out: '../html/assets/js/tapin.min.js',
    paths: {
        // flowplayer should reference the latest version we have loaded
        'flowplayer': 'flowplayer/flowplayer-3.2.10.min',
        'jquery': 'require-jquery'
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
})