define([], function()
{
    var _pin = function(lat, lon, uid, data)
    {
        var _this = this;
        this.Lat = null;
        this.Lon = null;
        this.Uid = null;
        this.Data = null;

        this.onClick = new TapIn.Event();

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
            return new _pin(this.Lat, this.Lon, this.Uid, this.Data);
        }

        constructor(lat, lon, uid, data);
    }

    return _pin;
})