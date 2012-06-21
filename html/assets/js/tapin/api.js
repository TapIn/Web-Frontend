define(['tapin/util/log', 'tapin/util/event', 'jquery', 'tapin/config', 'tapin/util/async'], function(Log, Event, JQuery, Config, Async, Frontend){
    var _staticApi = function(token)
    {
        var _this = this;
        var previous_requests = {};

        this.call = function(endpoint, params, lambda, error_lambda, type)
        {
            if (typeof(params) === 'string') {
                params += '&token=' + token + '&';
            } else if(typeof(params) === 'object') {
                params['token'] = token;
            }

            return _staticApi.call(endpoint, params, lambda, error_lambda, type);
        }

        this.update_object_by_key = function(obj, key, params, lambda, error_lambda)
        {
            Log('debug', 'Updating ' + key + '.', params);

            //Requires a token
            this.call(('update/' + obj + '/' + key), params, function(data){
                Log('debug', 'Update response: ', data.data);
                lambda(data.data);
            }, error_lambda, 'post');
        }

        this.delete_object_by_key = function(obj, key, params, lambda, error_lambda)
        {
            //Requires a token
            this.call(('delete/' + obj + '/' + key), params, function(data){
                Log('debug', 'Delete response: ', data.data);
                lambda(data.data);
            }, error_lambda, 'post');
        }

        this.get_object_by_key = function(obj, key, lambda, error_lambda)
        {
            _staticApi.get_object_by_key(obj, key, lambda, error_lambda);
        }

        this.get_object_by_secondary_key = function(obj, secondary, key, lambda, error_lambda)
        {
            _staticApi.get_object_by_secondary_key(obj, secondary, key, lambda, error_lambda);
        }
    }

    var previous_requests = {};

    _staticApi.onApiError = new Event();

    _staticApi.call = function(endpoint, params, lambda, error_lambda, type) {
        if (typeof(type) !== 'string') {
            type = 'get';
        }

        if (error_lambda === true) {
            error_lambda = function(err) {
                Log('warn', 'API call failed, but retrying...', err, endpoint, params, lambda, type);
                Async.later(2000, function(){
                    _staticApi.call(endpoint, params, lambda, error_lambda, type);
                });
            };
        } else if (typeof(error_lambda) !== 'function') {
            error_lambda = function(){};
        }

        if (endpoint in previous_requests) {
            previous_requests[endpoint].abort();
        }

        var conf = {
            url: Config['api']['base'] + endpoint,
            dataType: 'json',
            type: type,
            success: function(data) {
                lambda(data);
            },
            error: function(s, error) {
                error_lambda(error);
                _staticApi.onApiError.apply(error);
            }
        };

        if (type.toLowerCase() !== 'get') {
            conf['data'] = params;
        } else {
            var _params = params;
            if (typeof(params) === 'object')
            {
                params = "";
                for (var i in _params) {
                    params = params + _params[i] + '&';
                }
            }
            conf['url'] += '?' + params;
        }

        var xhttp = JQuery.ajax(conf);

        previous_requests[endpoint] = xhttp;
        return xhttp;
    }

    _staticApi.get_streams_by_location = function(north, east, south, west, start, end, lambda, error_lambda)
    {
        var params = 'topleft=' + north + '&topleft=' + east + '&bottomright=' + south + '&bottomright=' + west + '&start=' + start + '&end=' + end;

        _staticApi.call('get/streambylocation', params, function(data){
            lambda(data.data.streams);
        }, error_lambda);
    }

    _staticApi.login = function(username, password, lambda, error_lambda)
    {
         var params = 'username=' + username + '&password=' + password

         //This will return a token if login succeeded
        _staticApi.call('login', params, function(data){
            Log('debug', 'response data:', data.data);
            mixpanel.track('login');
            lambda(data);
        }, error_lambda, 'post')
    }

    _staticApi.register = function(username, password, lambda, error_lambda)
    {
         var params = 'username=' + username + '&password=' + password

         //This will return a token
        _staticApi.call('register', params, function(data){
            mixpanel.track('register');
            Log('debug', 'response data:', data.data);
            lambda(data);
        }, error_lambda, 'post')
    }

    _staticApi.get_object_by_key = function(obj, key, lambda, error_lambda)
    {
         var params = null

        _staticApi.call(('get/' + obj + "/" + key), params, function(data){
            Log('debug', 'response data:', data);
            lambda(data);
        }, error_lambda)
    }

    _staticApi.get_object_by_secondary_key = function(obj, secondary, key, lambda, error_lambda)
    {
         var params = null

         console.log(key);
        _staticApi.call(('get/' + obj + "by" + secondary + "/" + key), params, function(data){
            Log('debug', 'response data:', data);
            lambda(data);
        }, error_lambda)
    }

    _staticApi.get_stream_by_stream_id = function(id, lambda, error_lambda)
    {
        return _staticApi.get_object_by_key('stream', id, lambda, error_lambda);
    }

    return _staticApi;
})