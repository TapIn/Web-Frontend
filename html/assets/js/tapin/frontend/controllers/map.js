define([
       'jquery',
       'documentcloud/backbone',
       'tapin/frontend/map',
       'tapin/frontend/map/pin',
       'tapin/frontend/map/pincollection',
       'tapin/frontend/player',
       'tapin/frontend/timeslider',
       'tapin/api',
       'tapin/util/async',
       'tapin/util/log'],
       function(JQuery, Backbone, Map, Pin, PinCollection, Player, TimeSlider, Api, Async, Log)
{
    var main_map;
    var api;
    var player;
    var timeslider;

    var timescale;
    var updateMap = function()
    {
        var bounds = main_map.getBounds();
        var since_time = Math.floor(((new Date()).getTime()/1000) - timescale);
        Api.get_streams_by_location(bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1], since_time, 'now', function(streams){
            var new_pins = new PinCollection();
            for (var i in streams) {
                var stream = streams[i];
                var coords = streams[i][0]['coord'];
                var pin = new Pin(coords[0], coords[1], i, {stream_id: i});
                new_pins.addOrUpdatePin(pin);
            }

            main_map.Pins.replace(new_pins);
        })
    }

    var showVideoForPin = function(pin)
    {
        Api.get_stream_by_stream_id(pin.Data.stream_id, function(data){
            var server = 'rtmp://' + data.host + '/live/' + data.streamID;
            var endpoint = 'stream'
            Log('debug', 'Starting stream: ' + server + endpoint);
            player.playLive(server, endpoint);
        });
    }

    api = new Api();

    // Initialize frontend elements
    main_map = new Map($("#map"));
    player = new Player($("#player"));
    timeslider = new TimeSlider(JQuery('#time-slider'));

    // Bind to time slider events
    timeslider.onTimeChange.register(function(new_time){
        timescale = new_time;
        updateMap();
    });

    // Redraw pins on map move
    main_map.onBoundsChange.register(updateMap);

    // Show video when we click a pin
    main_map.onPinClick.register(showVideoForPin);

    // Get an initial update
    Async.later(1000, updateMap);

    // Fake live
    Async.every(2 * 1000, updateMap);


    // And now the controller:
    var app = new (Backbone.Router.extend(new function(){
        this.routes = {
            'map/:time': 'showMap'
        }

        this.showMap = function(time)
        {
            timeslider.selectTime(time);
        }
    }));

    timeslider.onTimeChange.register(function(time, name){
        app.navigate('map/' + name);
    })
});