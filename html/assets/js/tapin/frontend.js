define([
       'jquery',
       'tapin/frontend/map',
       'tapin/frontend/map/pin',
       'tapin/frontend/map/pincollection',
       'tapin/frontend/player',
       'tapin/frontend/timeslider',
       'tapin/api',
       'tapin/util/async',
       'tapin/util/log'],
       function(JQuery, Map, Pin, PinCollection, Player, TimeSlider, Api, Async, Log)
{
    return new (function(){
        var _this = this;

        this.mainMap = null;
        this.api = null;
        this.player = null;
        this.timeslider = null;

        this.timescale;
        this.updateMap = function()
        {
            var bounds = this.mainMap.getBounds();
            var since_time = Math.floor(((new Date()).getTime()/1000) - this.timescale);
            Api.get_streams_by_location(bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1], since_time, 'now', function(streams){
                var new_pins = new PinCollection();
                for (var i in streams) {
                    var stream = streams[i];
                    var coords = streams[i][0]['coord'];
                    var pin = new Pin(coords[0], coords[1], i, {stream_id: i});
                    new_pins.addOrUpdatePin(pin);
                }

                _this.mainMap.Pins.replace(new_pins);
            })
        }

        this.showVideoForPin = function(pin)
        {
            Api.get_stream_by_stream_id(pin.Data.stream_id, function(data){
                var server = 'rtmp://' + data.host + '/live/' + data.streamID;
                var endpoint = 'stream'
                Log('debug', 'Starting stream: ' + server + endpoint);
                player.playLive(server, endpoint);
            });
        }

        this.constructor = function(){
            api = new Api();

            // Initialize frontend elements
            this.mainMap = new Map($("#map"));
            this.player = new Player($("#player"));
            this.timeslider = new TimeSlider(JQuery('#time-slider'));

            // Bind to time slider events
            this.timeslider.onTimeChange.register(function(new_time){
                _this.timescale = new_time;
                _this.updateMap();
            });

            // Redraw pins on map move
            this.mainMap.onBoundsChange.register(_this.updateMap);

            // Show video when we click a pin
            this.mainMap.onPinClick.register(_this.showVideoForPin);

            // Get an initial update
            Async.later(1000, _this.updateMap);

            // Fake live
            Async.every(2 * 1000, _this.updateMap);
        }

        this.constructor();
    });
});