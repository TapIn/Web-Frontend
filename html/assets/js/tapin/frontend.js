define([
       'jquery',
       'tapin/frontend/map',
       'tapin/frontend/map/pin',
       'tapin/frontend/map/pincollection',
       'tapin/frontend/sidebar',
       'tapin/frontend/timeslider',
       'tapin/api',
       'tapin/util/async',
       'tapin/util/log',
       'tapin/config'],
       function(JQuery, Map, Pin, PinCollection, Sidebar, TimeSlider, Api, Async, Log, Config)
{
    return new (function(){
        var _this = this;

        this.mainMap = null;
        this.api = null;
        this.sidebar = null;
        this.timeslider = null;

        var preloader = null;
        var _modalPage = null;
        var _modalPageContent = null;

        this.timescale = 10*60;
        var showPreloaderRef;
        this.updateMap = function()
        {
            var bounds = _this.mainMap.getBounds();

            var timescale = this.timescale;
            if (typeof(this.timescale) === 'undefined') { // TODO: For some reason this.timescale isn't being set correctly.
                timescale = 10 * 60;
            }

            var since_time = Math.floor(((new Date()).getTime()/1000) - timescale);

            // Show the preloader if the request takes too long
            showPreloaderRef = Async.later(600, function(){
                _this.showPreloader();
            });

            Api.get_streams_by_location(bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1], since_time, 'now', function(streams){
                // Don't show the preloader/remove the preloader when we're done
                clearTimeout(showPreloaderRef);
                _this.hidePreloader();

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
            Log('info', "Showing fullpage modal: ", html);
            _modalPageContent.html(html);
            _modalPage.removeClass('hidden');
        }

        this.showPreloader = function() {
            Async.poll(50, function(){
                var pos = preloader.css('background-position-x');
                pos = pos.substring(0, pos.length - 2);
                return (pos == "-1");
            }, function(){
                preloader.removeClass('hidden');
            })
        }

        this.hidePreloader = function() {
            Async.poll(50, function(){
                var pos = preloader.css('background-position-x');
                pos = pos.substring(0, pos.length - 2);
                return (pos == "-1");
            }, function(){
                preloader.addClass('hidden');
            })
        }

        this.showVideo = function(stream_id)
        {
            Api.get_stream_by_stream_id(stream_id, function(data){
                var server = 'rtmp://' + data.host + '/live/' + data.streamID;
                var endpoint = 'stream'
                Log('info', 'Starting stream: ' + server + endpoint);
                _this.sidebar.player.playLive(server, endpoint);
            });
        }

        window.inStage = function() {
            Log('info', 'Switching API calls to stage.');
            Config['api']['base'] = 'http://stage.api.tapin.tv/web/';
        }

        var showVideoForPin = function(pin)
        {
            Backbone.history.navigate('video/' + pin.Data.stream_id + '/now');
        }

        this.constructor = function(){
            api = new Api();

            Api.onApiError.register(function(){
                Log('warn', 'Request timed out')
            })

            // Initialize frontend elements
            this.mainMap = new Map(JQuery("#map"));
            this.sidebar = new Sidebar(JQuery("#sidebar"));
            this.timeslider = new TimeSlider(JQuery('#time-slider'));
            _modalPage = JQuery('<div class="hidden" id="modal-page"></div>');
            _modalPageContent = JQuery('<div id="modal-content"></div>');
            _modalPage.append(_modalPageContent);

            preloader = JQuery("#map-preloader");

            this.timeslider.selectTime('now');

            JQuery("html").append(_modalPage);

            Async.every(50, function(){
                var previous_location = preloader.css('background-position-x');
                previous_location = previous_location.substring(0, previous_location.length - 2);
                var new_location = (previous_location - 68) % 952;
                preloader.css('background-position-x', new_location + 'px');
            })

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