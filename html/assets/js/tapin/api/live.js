define(['tapin/util/event', 'tapin/util/log', 'tapin/api/live/waiter'], function(Event, Log, Waiter){
    return function()
    {
        var _this = this;
        var _waiterPool = [];
        var _dataHandlers = {};

        // Events
        this.onDataIncoming = new Event();
        this.onApiError = new Event();

        this.onWaiterBirth = new Event();
        this.onWaiterDeath = new Event();
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
            Log('debug', 'Birthing waiters.');

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
            _waiterPool.push(new Waiter(
                function(data)
                {
                    _this.onDataIncoming.apply(data);
                    _this.onWaiterDeath.apply(this);
                },
                function(err)
                {
                    _this.onApiError.apply(err);
                    _this.onWaiterDeath.apply(err);
                }
            ));
            _this.onWaiterBirth.apply(_waiterPool[_waiterPool.length - 1]);
        }

        var constructor = function()
        {
            _this.onDataIncoming.register(onDataIncomingHandler);
            _this.onApiError.register(onApiErrorHandler);

            _this.onWaiterBirth.register(function(){Log('debug', "Waiter was born.");});
            _this.onWaiterDeath.register(function(err){Log('debug', "Waiter died: " + err);});

            //_this.birthWaiters();
        }
        constructor();
    }
})