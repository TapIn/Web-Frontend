define(['./tapin/frontend/map', './tapin/frontend/map/pin', './tapin/frontend/map/pincollection', './tapin/frontend/player', './tapin/api', './tapin/util/async', './tapin/util/log'], function(Map, Pin, PinCollection, Player, Api, Async, Log){
    var main_map;
    var api;
    var player;

    var time_now = 60 * 10; // Last 10 minutes
    var time_hour = 60 * 60;
    var time_day = time_hour * 24;
    var time_week = time_day * 7;
    var time_month = time_day * 31;
    var time_year = time_day * 365;
    var time_all = Math.floor((new Date()).getTime()/1000);

    var timescale = time_now;

    var updateMap = function()
    {
        var bounds = main_map.getBounds();
        var since_time = Math.floor(((new Date()).getTime()/1000) - timescale);
        api.get_streams_by_location(bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1], since_time, 'now', function(streams){
            var new_pins = new PinCollection();
            for (var i in streams) {
                var stream = streams[i];
                var coords = streams[i][0]['coord'];
                var pin = new Pin(coords[0], coords[1], i, {stream_id: i});
                new_pins.addOrUpdatePin(pin);
            }

            main_map.Pins.replace(new_pins);
        })
    };

    var showVideoForPin = function(pin)
    {
        api.get_stream_by_stream_id(pin.Data.stream_id, function(data){
            var server = 'rtmp://' + data.host + '/live/' + data.streamID;
            var endpoint = 'stream'
            Log('debug', 'Starting stream: ' + server + endpoint);
            player.playLive(server, endpoint);
        });
    }

    $(document).ready(function(){
        // Initialize frontend elements
        main_map = new Map($("#map"));
        player = new Player($("#player"));
        api = new Api();

        // Bind to time slider events
        $(".time-slider li").click(function(){
            var time = $(this).attr('data-time');
            switch(time) {
                case 'now' :
                    timescale = time_now;
                    break;
                case 'hour' :
                    timescale = time_hour;
                    break;
                case 'day':
                    timescale = time_day;
                    break;
                case 'week':
                    timescale = time_week;
                    break;
                case 'month':
                    timescale = time_month;
                    break;
                case 'year':
                    timescale = time_year;
                    break;
                case 'all':
                    timescale = time_all;
                    break;
            }

            $(".time-slider li").each(function(){
                $(this).removeClass('current');
            })

            $(this).addClass('current');

            updateMap();
        });

        // Redraw pins on map move
        main_map.OnBoundsChange.register(updateMap);

        // Show video when we click a pin
        main_map.OnPinClick.register(showVideoForPin);

        // Get an initial update
        Async.later(100,updateMap);

        // Fake live
        Async.every(2 * 1000, updateMap);
    });
})