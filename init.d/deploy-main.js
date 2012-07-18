({
    baseUrl: "../html-compiled/assets/js-inprogress",
    name: 'tapin',
    out: '../html-compiled/assets/js-inprogress/tapin.out.js',
    paths: {
        // flowplayer should reference the latest version we have loaded
        'flowplayer': 'flowplayer/flowplayer-3.2.10.min',
        'jquery': 'require-jquery'
    },
    optimize: 'none',
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