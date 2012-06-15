define([
       'jquery',
       'tapin/frontend/map',
       'tapin/frontend/map/pin',
       'tapin/frontend/map/pincollection',
       'tapin/frontend/sidebar',
       'tapin/frontend/timeslider',
       'tapin/api',
       'tapin/util/async',
       'tapin/util/log'],
       function(JQuery, Map, Pin, PinCollection, Sidebar, TimeSlider, Api, Async, Log)
{
    return new (function(){
        var _this = this;

        this.mainMap = null;
        this.api = null;
        this.sidebar = null;
        this.timeslider = null;

        var _modalPage = null;
        var _modalPageContent = null;

        this.timescale;
        this.updateMap = function()
        {
            var bounds = _this.mainMap.getBounds();
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

        this.updateNav = function(page)
        {
            var matchingPage = JQuery('ul.nav li a[href="#' + page + '"]');
            if (matchingPage.length > 0) {
                JQuery('ul.nav li').each(function(){
                    $(this).removeClass('active');
                });
                matchingPage.parent().addClass('active');
            }
        }

        this.closeModalPage = function()
        {
            _modalPageContent.html('');
            _modalPage.addClass('hidden');
        }

        this.showModalPage = function(html)
        {
            Log('debug', "Showing fullpage modal: ", html);
            _modalPageContent.html(html);
            _modalPage.removeClass('hidden');
        }

        this.showVideo = function(stream_id)
        {
            Api.get_stream_by_stream_id(stream_id, function(data){
                var server = 'rtmp://' + data.host + '/live/' + data.streamID;
                var endpoint = 'stream'
                Log('debug', 'Starting stream: ' + server + endpoint);
                _this.sidebar.player.playLive(server, endpoint);
            });
        }

        var showVideoForPin = function(pin)
        {
            Backbone.history.navigate('video/' + pin.Data.stream_id + '/now');
        }

        this.constructor = function(){
            api = new Api();

            // Initialize frontend elements
            this.mainMap = new Map(JQuery("#map"));
            this.sidebar = new Sidebar(JQuery("#sidebar"));
            this.timeslider = new TimeSlider(JQuery('#time-slider'));
            _modalPage = JQuery('<div class="hidden" id="modal-page"></div>');
            _modalPageContent = JQuery('<div id="modal-content"></div>');
            _modalPage.append(_modalPageContent);

            this.timeslider.selectTime('now');

            JQuery("html").append(_modalPage);

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