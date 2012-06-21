define(['tapin/util/log', 'tapin/util/event', 'jquery', 'tapin/config', 'tapin/util/async'], function(Log, Event, JQuery, Config, Async){
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

        this.update_object_by_key = function(obj, key, paramsDict, lambda, error_lambda)
        {
            var params = '';

            for (var key in paramsDict){
                if (arr.hasOwnProperty(k)) {
                    params = params + key + '=' + paramsDict[key] + '&'
                }
            }

            Log('debug', 'Updating ' + key + '.', paramsDict);

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
                Async.later(500, function(){
                    _staticApi.call(endpoint, params, lambda, error_lambda, type);
                });
            };
        } else if (typeof(error_lambda) !== 'function') {
            error_lambda = function(){};
        }

        if (endpoint in previous_requests) {
            previous_requests[endpoint].abort();
        }

        var _params = params;
        if (typeof(params) === 'object')
        {
            params = "";
            for (var i in _params) {
                params = params + _params[i] + '&';
            }
        }

        var xhttp = JQuery.ajax({
            url: Config['api']['base'] + endpoint + '?' + params,
            dataType: 'json',
            type: type,
            success: function(data) {
                lambda(data);
            },
            error: function(s, error) {
                error_lambda(error);
                _staticApi.onApiError.apply(error);
            }
        });

        previous_requests[endpoint] = xhttp;
        return xhttp;
    }

    _staticApi.get_streams_by_location = function(north, east, south, west, start, end, lambda, error_lambda)
    {
        var params = 'topleft=' + north + '&topleft=' + east + '&bottomright=' + south + '&bottomright=' + west + '&start=' + start + '&end=' + end;

        _staticApi.call('get/streambylocation', params, function(data){
            Log('debug', 'Stream data recieved: ', data.data.streams);
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
            lambda(data.data);
        }, error_lambda)
    }

    _staticApi.register = function(username, password, lambda, error_lambda)
    {
         var params = 'username=' + username + '&password=' + password

         //This will return a token
        _staticApi.call('register', params, function(data){
            mixpanel.track('register');
            Log('debug', 'response data:', data.data);
            lambda(data.data);
        }, error_lambda)
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