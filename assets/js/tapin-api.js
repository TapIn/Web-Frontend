TapIn.Api = function()
{
    var _this = this;
    this.Live = new TapIn.Api.Live();

    var base = "http://stage.api.tapin.tv/web/";

    // Events
    this.OnApiError = new TapIn.Event();

    this.call = function(endpoint, lambda) {
        return $.ajax({
            url: base + endpoint,
            dataType: 'json',
            success: function(data) {
                lambda(data);
            },
            error: function(s, error) {
                _this.OnApiError.apply(error);
            }
        });
    }

    var prev_get_streams = null;
    this.get_streams_by_location = function(north, east, south, west, start, end, lambda)
    {
        var endpoint = 'getstreamsbylocation?topleft=' + north + ',topleft=' + east + '&bottomright=' + south + ',bottomright=' + west + '&start=' + start + '&end=' + end;

        if (prev_get_streams !== null) {
            prev_get_streams.abort();
        }

        prev_get_streams = this.call(endpoint, function(data){
            TapIn.Log('debug', 'Stream data recieved: ', data.data.streams)
            lambda(data.data.streams);
        });
    }
};

TapIn.Api.Live = function()
{
    var _this = this;
    var _waiterPool = [];
    var _dataHandlers = {};

    // Events
    this.OnDataIncoming = new TapIn.Event();
    this.OnApiError = new TapIn.Event();

    this.OnWaiterBirth = new TapIn.Event();
    this.OnWaiterDeath = new TapIn.Event();
    this.RegisterDataHandler = function(data_type, lambda)
    {
        if (!(data_type in _dataHandlers)) {
            _dataHandlers[data_type] = [];
        }

        _dataHandlers[data_type].push(lambda);
    }

    var onDataIncomingHandler = function(data)
    {
        if (data.type in _dataHandlers) {
            for (var i in _dataHandlers[data.type]) {
                _dataHandlers[data.type][i](data.payload);
            }
        }
    }
    var onApiErrorHandler = function(err)
    {
        if (err !== 'abort') {
            setTimeout(birthWaiter, 1500);
        }
    }

    this.killWaiters = function()
    {
        for (var i in _waiterPool) {
            _waiterPool[i].kill();
        }
    }

    this.birthWaiters = function(count)
    {
        TapIn.Log('debug', 'Birthing waiters.');

        if (typeof(count) === 'undefined') {
            count = 5;
        }

        for(var i = 0; i < count; i++)
        {
            birthWaiter();
        }
    }

    var birthWaiter = function()
    {
        _waiterPool.push(new TapIn.Api.Live.Waiter(
            function(data)
            {
                _this.OnDataIncoming.apply(data);
                _this.OnWaiterDeath.apply(this);
            },
            function(err)
            {
                _this.OnApiError.apply(err);
                _this.OnWaiterDeath.apply(err);
            }
        ));
        _this.OnWaiterBirth.apply(_waiterPool[_waiterPool.length - 1]);
    }

    var constructor = function()
    {
        _this.OnDataIncoming.register(onDataIncomingHandler);
        _this.OnApiError.register(onApiErrorHandler);

        _this.OnWaiterBirth.register(function(){TapIn.Log('debug', "Waiter was born.");});
        _this.OnWaiterDeath.register(function(err){TapIn.Log('debug', "Waiter died: " + err);});

        //_this.birthWaiters();
    }
    constructor();
}

TapIn.Api.Live.Waiter = function(success_lambda, failure_lambda)
{
    var xhr = null;
    var endpoint = "http://live.api.tapin.tv/";


    var constructor = function(success_lambda, failure_lambda)
    {
        xhr = $.ajax({
            url: endpoint,
            dataType: 'json',
            success: function(data) {
                success_lambda(data);
            },
            error: function(s, error) {
                failure_lambda(error);
            }
        });
    }

    var kill = function()
    {
        xhr.abort();
    }

    constructor(success_lambda, failure_lambda);
}