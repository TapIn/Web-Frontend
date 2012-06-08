TapIn.Frontend.Map = function(elem)
{
    var _this = this;
    var _elem = null;

    // Properties
    this.Pins = new TapIn.Frontend.Map.PinCollection();

    // Events
    this.OnZoom = new TapIn.Event();
    this.OnPan = new TapIn.Event();

    var onPinAdd = function(pin)
    {
        TapIn.Log('debug', "Pin added");
    }

    var onPinUpdate = function(pin)
    {
        TapIn.Log('debug', "Pin updated");
    }

    var onPinRemove = function(pin)
    {
        TapIn.Log('debug', "Pin removed");
    }

    var constructor = function(elem)
    {
        _elem = elem;

        TapIn.Log('debug', "Map initialized!", elem);

        _this.Pins.OnPinAdd.register(onPinAdd);
        _this.Pins.OnPinUpdate.register(onPinUpdate);
        _this.Pins.OnPinRemove.register(onPinRemove);
    }
    constructor();
}

TapIn.Frontend.Map.PinCollection = function()
{
    this._pins = {};

    // Events
    this.OnPinAdd = new TapIn.Event();
    this.OnPinUpdate = new TapIn.Event();
    this.OnPinRemove = new TapIn.Event();

    // TODO: automatically remove pins if we don't hear from them in a specified time

    this.addOrUpdatePin = function(pin)
    {
        var _event = null;
        if (pin.StreamId in this._pins) {
            var oldPin = this._pins[pin.StreamId];
            if (pin.Lat !== oldPin.Lat || pin.Lon !== oldPin.Lon) {
                this._pins[pin.StreamId] = pin.clone();
                this.OnPinUpdate.apply(this._pins[pin.StreamId]);
            }
        } else {
            this._pins[pin.StreamId] = pin.clone();
            this.OnPinAdd.apply(this._pins[pin.StreamId]);
        }
    }

    this.removePin = function(pin)
    {
        if (pin.StreamId in this._pins) {
            delete this._pins[pin.StreamId];
            this.OnPinRemove.apply(pin);
            return true;
        } else {
            return false;
        }
    }

    this.replace = function(pinCollection)
    {
        // Process pin additions and updates
        for (var i in pinCollection._pins) {
            this.addOrUpdatePin(pinCollection._pins[i]);
        }

        // Process pin removals
        for (var i in this._pins) {
            if (!(this._pins[i] in pinCollection._pins)) {
                this.removePin(this._pins[i]);
            }
        }
    }
}

TapIn.Frontend.Map.Pin = function(stream_id, lat, lon)
{
    var _this = this;
    this.Lat = null;
    this.Lon = null;
    this.StreamId = null;

    var constructor = function(stream_id, lat, lon)
    {
        _this.Lat = lat;
        _this.Lon = lon;
        _this.StreamId = stream_id;
    }

    this.clone = function()
    {
        return new TapIn.Frontend.Map.Pin(this.StreamId, this.Lat, this.Lon);
    }

    constructor(stream_id, lat, lon);
}