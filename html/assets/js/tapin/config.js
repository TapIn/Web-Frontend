/**
 * Config
 *
 * Manages configuration information
 *
 * @static
 */
define([], function(){
    // Set up default configuration settings
    var config = {
        logs: {
            level: 'error',
            send: true
        },
        mixpanel: {
            key: 'a85073e95810f6d2823beee9c85996a9'
        },
        api: {
            base: 'http://api.tapin.tv/web/'
        }
    };

    // Auto-enable debug settings if we're not on the main server
    if (window.location.hostname !== 'www.tapin.tv') {
        config['mixpanel']['key'] = 'ad2c04ad65bc38f15c4bfd34a6732da6';
        config['logs']['level'] = 'debug';
        config['logs']['send'] = false;
    }

    // If we're on stage, use the staging API server
    if (window.location.hostname == 'stage.tapin.tv') {
        config['api']['base'] = 'http://stage.api.tapin.tv/web/';
    }

    return config;
});