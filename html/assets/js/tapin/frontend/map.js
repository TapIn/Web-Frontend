define(['tapin/frontend/map/pincollection', 'tapin/util/log', 'tapin/util/event'], function(PinCollection, Log, Event){
    return function(elem)
    {
        var _this = this;
        var _elem = null;
        var _map = null;
        var _markers = {};

        // Properties
        this.Pins = new PinCollection();

        // Events
        this.onZoom = new Event();
        this.onPan = new Event();
        this.onBoundsChange = new Event();
        this.onPinClick = new Event();

        /**
         * Pans the map to the location without changing the zoom level.
         * @param  float lat Latitude
         * @param  float lon Longitude
         * @return Object    The current object
         */
        this.center = function(lat, lon)
        {
            Log('debug', 'Attempting to change center to [' + lat + ',' + lon + ']');
            _map.panTo(new google.maps.LatLng(lat, lon));
            return this;
        }

        /**
         * Zooms the map to the level specified without changing the center.
         * @param  int      level   Zoom level
         * @return Object           The current object
         */
        this.zoom = function(level)
        {
            Log('debug', 'Attempting to change zoom to ' + level);
            _map.setZoom(level);
            return this;
        }

        /**
         * Pans and zooms the map to fit the square formed by the points
         * @param  float north Top lat
         * @param  float east  Left long
         * @param  float south Bottom lat
         * @param  float west  Right long
         * @return Object      The current object
         */
        this.goBound = function(north, east, south, west)
        {
            Log('info', 'Moving map to [' + north + ',' + east + '],[' + south + ',' + west + ']');
            _map.panToBounds(new google.maps.LatLng(south, west), new google.maps.LatLng(north, east));
            return this;
        }

        /**
         * Pans and zooms the map to fit all of the points specified
         * @param  array points Array of points (e.g. [[lat,long],[lat,long],...])
         * @return Object       The current object
         */
        this.goFit = function(points)
        {
            var north = 0;
            var south = 0;
            var east = 0;
            var west = 0;

            for (var i in points) {
                var point = points[i];
                var lat = point[0];
                var lon = point[1];

                if (lat > north) {
                    north = lat;
                }

                if (lat < south) {
                    south = lat;
                }

                if (lon > east) {
                    east = lon;
                }

                if (lon < west) {
                    west = lon;
                }
            }

            this.goBound(north, east, south, west);
            return this;
        }

        /**
         * Gets the bounds of the current map view
         * @return Array Array of bounds: [[n,e],[s,w]]
         */
        this.getBounds = function()
        {
            var gm_bounds = _map.getBounds();
            var ne = gm_bounds.getNorthEast();
            var sw = gm_bounds.getSouthWest();

            // Sometimes the ne bound is actually the sw:
            var n = ne.lat();
            var e = ne.lng();
            var s = sw.lat();
            var w = sw.lng();

            if (s > n) {
                var tmp = n;
                n = s;
                s = tmp;
            }

            if (w > e) {
                var tmp = w;
                w = e;
                e = tmp;
            }

            // Google maps sometimes messes up on the bounds when we're close to a border (since 179E + 2 = -179E)
            if (this.getZoom() <= 4) {
                n =   90;
                s =  -90;
                e =  180;
                w = -180;
            }

            n = n % 180;
            s = s % 180;
            e = e % 360;
            w = w % 360;

            // TODO: It's still possible the bounds could mess up if we're looking at streams in the Pacific islands at a close zoom level.

            return [[n,e],[s,w]];
        }

        /**
         * Gets the current center of the map
         * @return Array LatLon of the center of the map
         */
        this.getCenter = function()
        {
            var center = _map.getCenter();
            return [center.lat(), center.lng()];
        }

        /**
         * Gets the zoom of the current map view
         * @return int Zoom level, however you define that
         */
        this.getZoom = function()
        {
            return _map.getZoom();
        }


        // Google maps "drag" event is broken. We'll fix it here:
        var _center_changed = false;
        var onCenterChanged = function()
        {
            _center_changed = true;
        }

        var onMouseUp = function()
        {
            if (_center_changed) {
                _center_changed = false;
                _this.onPan.apply();
            }
        }

        var onPinAdd = function(pin)
        {
            Log('debug', "Pin added");
            _markers[pin.Uid] = new google.maps.Marker({
                position: new google.maps.LatLng(pin.Lat, pin.Lon),
                map: _map
            });

            google.maps.event.addListener(_markers[pin.Uid], "click", pin.onClick.apply);

            pin.onClick.register(function(){
                _this.onPinClick.apply(pin);
                Log('debug', 'Pin clicked!', pin);
            });
        }

        var onPinUpdate = function(pin)
        {
            Log('debug', "Pin updated");
            _markers[pin.Uid].setPosition(new google.maps.LatLng(pin.Lat, pin.Lon));
        }

        var onPinRemove = function(pin)
        {
            Log('debug', "Pin removed");
            _markers[pin.Uid].setMap(null);
            delete _markers[pin.Uid];
        }

        var constructor = function(elem)
        {
            if (elem instanceof jQuery) {
                elem = elem[0];
            }

            _elem = elem;

            Log('info', "Map initialized!");

            // 40.0024331757129, 269.88193994140624, 5 => All of US
            // 37.70751808422908, -122.1353101196289, 11 => Bay Area

            _map = new google.maps.Map(_elem, {
                center: new google.maps.LatLng(37.53021200558681, -122.12295050048827),
                zoom: 11,
                minZoom: 3,
                panControl: false,
                zoomControl: false,
                mapTypeControl: false,
                overviewMapControl: false,
                rotateControl: false,
                scaleControl: false,
                streetViewControl: false,
                center_changed: onCenterChanged,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            $(document).mouseup(function(){
                onMouseUp();
                Log('debug', 'Mouse up!');
            });

            // Tracking
            _this.onPan.register(function(){
                Log('info', 'Centering map on [' + _this.getCenter()[0] + ',' + _this.getCenter()[1] + ']');
                mixpanel.track('pan');
            });

            _this.onZoom.register(function(){
                Log('info', 'Zooming map to ' + _this.getZoom());
                mixpanel.track('zoom');
                mixpanel.track('zoom_' + _this.getZoom());
            });

            // TODO: We can't specify a max bounds in the map control, but it's annoying to have the map pan off the screen.
            //       We should implement something like this: http://stackoverflow.com/questions/3125065/how-do-i-limit-panning-in-google-maps-api-v3

            _map.zoom_changed = _this.onZoom.apply;
            _map.drag_ended = _this.onPan.apply;

            _this.Pins.onPinAdd.register(onPinAdd);
            _this.Pins.onPinUpdate.register(onPinUpdate);
            _this.Pins.onPinRemove.register(onPinRemove);

            _this.onPan.register(_this.onBoundsChange.apply);
            _this.onZoom.register(_this.onBoundsChange.apply);
        }
        constructor(elem);
    }
});