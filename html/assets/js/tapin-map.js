TapIn.Frontend.Map = function(elem)
{
    var _this = this;
    var _elem = null;
    var _map = null;
    var _markers = {};

    // Properties
    this.Pins = new TapIn.Frontend.Map.PinCollection();

    // Events
    this.OnZoom = new TapIn.Event();
    this.OnPan = new TapIn.Event();
    this.OnBoundsChange = new TapIn.Event();
    this.OnPinClick = new TapIn.Event();

    /**
     * Pans the map to the location without changing the zoom level.
     * @param  float lat Latitude
     * @param  float lon Longitude
     * @return Object    The current object
     */
    this.center = function(lat, lon)
    {
        TapIn.Log('debug', 'Centering map on [' + lat + ',' + lon + ']');
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
        TapIn.Log('debug', 'Zooming map to ' + level);
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
        TapIn.Log('Moving map to [' + north + ',' + east + '],[' + south + ',' + west + ']');
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
            _this.OnPan.apply();
        }
    }

    var onPinAdd = function(pin)
    {
        TapIn.Log('debug', "Pin added");
        _markers[pin.Uid] = new google.maps.Marker({
            position: new google.maps.LatLng(pin.Lat, pin.Lon),
            map: _map
        });

        google.maps.event.addListener(_markers[pin.Uid], "click", pin.OnClick.apply);

        pin.OnClick.register(function(){
            _this.OnPinClick.apply(pin);
        });
    }

    var onPinUpdate = function(pin)
    {
        TapIn.Log('debug', "Pin updated");
        _markers[pin.Uid].setPosition(new google.maps.LatLng(pin.Lat, pin.Lon));
    }

    var onPinRemove = function(pin)
    {
        TapIn.Log('debug', "Pin removed");
        _markers[pin.Uid].setMap(null);
        delete _markers[pin.Uid];
    }

    var constructor = function(elem)
    {
        if (elem instanceof jQuery) {
            elem = elem[0];
        }

        _elem = elem;

        TapIn.Log('debug', "Map initialized!");

        _map = new google.maps.Map(_elem, {
            center: new google.maps.LatLng(40.0024331757129, 269.88193994140624),
            zoom: 5,
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
        });

        // TODO: We can't specify a max bounds in the map control, but it's annoying to have the map pan off the screen.
        //       We should implement something like this: http://stackoverflow.com/questions/3125065/how-do-i-limit-panning-in-google-maps-api-v3

        _map.zoom_changed = _this.OnZoom.apply;
        _map.drag_ended = _this.OnPan.apply;

        _this.Pins.OnPinAdd.register(onPinAdd);
        _this.Pins.OnPinUpdate.register(onPinUpdate);
        _this.Pins.OnPinRemove.register(onPinRemove);

        _this.OnPan.register(_this.OnBoundsChange.apply);
        _this.OnZoom.register(_this.OnBoundsChange.apply);
    }
    constructor(elem);
}

TapIn.Frontend.Map.PinCollection = function()
{
    this._pins = {};

    // Events
    this.OnPinAdd = new TapIn.Event();
    this.OnPinUpdate = new TapIn.Event();
    this.OnPinRemove = new TapIn.Event();

    /**
     * Adds the pin, or updates it if it's already in the collection
     * @param Object pin The pin to add or update
     */
    this.addOrUpdatePin = function(pin)
    {
        var _event = null;
        if (pin.Uid in this._pins) {
            var oldPin = this._pins[pin.Uid];
            if (pin.Lat !== oldPin.Lat || pin.Lon !== oldPin.Lon) {
                this._pins[pin.Uid] = pin.clone();
                this.OnPinUpdate.apply(this._pins[pin.Uid]);
            }
        } else {
            this._pins[pin.Uid] = pin.clone();
            this.OnPinAdd.apply(this._pins[pin.Uid]);
        }
    }

    /**
     * Removes the pin from the collection
     * @param  Object pin_or_uid The pin to remove, or its UID
     */
    this.removePin = function(pin_or_uid)
    {
        var pin = null;
        var uid = null;
        if (pin_or_uid instanceof TapIn.Frontend.Map.Pin) {
            uid = pin_or_uid.Uid;
        } else {
            uid = pin_or_uid;
        }

        pin = this._pins[uid].clone();

        if (pin.Uid in this._pins) {
            delete this._pins[uid];
            this.OnPinRemove.apply(pin);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Gets the pin
     * @param  int     uid  The UID of the pin to get
     * @return Object       The pin
     */
    this.getPin = function(uid)
    {
        if (uid in this._pins) {
            return this._pins[uid].clone();
        } else {
            return undefined;
        }
    }

    /**
     * Replaces the PinCollection with another
     * @param  Object pinCollection The PinCollection to update with
     */
    this.replace = function(pinCollection)
    {
        // Process pin additions and updates
        for (var i in pinCollection._pins) {
            this.addOrUpdatePin(pinCollection._pins[i]);
        }

        // Process pin removals
        for (var i in this._pins) {
            if (!(this._pins[i].Uid in pinCollection._pins)) {
                this.removePin(this._pins[i]);
            }
        }
    }

    /**
     * Removes all pins from the collection
     */
    this.clear = function()
    {
        for (var i in this._pins) {
            this.removePin(this._pins[i]);
        }
    }
}

TapIn.Frontend.Map.Pin = function(lat, lon, uid, data)
{
    var _this = this;
    this.Lat = null;
    this.Lon = null;
    this.Uid = null;
    this.Data = null;

    this.OnClick = new TapIn.Event();

    var constructor = function(lat, lon, uid, data)
    {
        _this.Lat = lat;
        _this.Lon = lon;
        if (typeof(uid) === 'undefined' || uid === null)
        {
            _this.Uid = Math.floor(Math.random()*1000000000000);
        } else {
            _this.Uid = uid;
        }

        _this.Data = data;
    }

    /**
     * Gets a deep copy of the object
     * @return Object Copy of the object
     */
    this.clone = function()
    {
        return new TapIn.Frontend.Map.Pin(this.Lat, this.Lon, this.Uid, this.Data);
    }

    constructor(lat, lon, uid, data);
}