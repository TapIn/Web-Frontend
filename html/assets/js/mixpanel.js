/**
 * Mixpanel
 * Loads Mixpanel from Mixpanel's servers
 */
define(['tapin/config', 'tapin/util/log'], function(Config, Log){
    mixpanel.init(Config['mixpanel']['key']);
    Log('debug', 'Initialized mixpanel with key ' + Config['mixpanel']['key']);
})