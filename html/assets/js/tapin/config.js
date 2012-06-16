define([], function(){
    var config = {
        logs: {
            level: 'error',
            send: true
        },
        mixpanel: {
            key: 'a85073e95810f6d2823beee9c85996a9'
        }
    };

    // Auto-enable debug settings
    if (window.location.hostname !== 'tapin.tv' || window.location.protocol === 'file:') {
        config['logs']['level'] = 'debug';
        config['logs']['send'] = false;

        config['mixpanel']['key'] = 'ad2c04ad65bc38f15c4bfd34a6732da6';
    }

    return config;
});