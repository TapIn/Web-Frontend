({
    baseUrl: "../html/assets/js-inprogress",
    name: 'tapin-mobile',
    out: '../html/assets/js-inprogress/tapin-mobile.out.js',
    paths: {
        'jquery': 'require-jquery'
    },
    optimize: 'none',
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
})