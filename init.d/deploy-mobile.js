({
    baseUrl: "../html/assets/js",
    name: 'tapin-mobile',
    out: '../html/assets/js/tapin-mobile.min.js',
    paths: {
        'jquery': 'require-jquery'
    },
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