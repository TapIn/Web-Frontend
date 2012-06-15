define(['tapin/util/log', 'tapin/util/event', 'jquery'], function(Log, Event, JQuery){
    var _staticApi = function()
    {
        var _this = this;
        var previous_requests = {};
    }

    var previous_requests = {};
    _staticApi.base = "http://api.tapin.tv/web/";

    _staticApi.onApiError = new Event();

    _staticApi.stage = function(){
        _staticApi.base = "http://stage.api.tapin.tv/web/";
    }

    _staticApi.call = function(endpoint, params, lambda) {
        if (endpoint in previous_requests) {
            previous_requests[endpoint].abort();
        }

        var xhttp = JQuery.ajax({
            url: _staticApi.base + endpoint + '?' + params,
            dataType: 'json',
            success: function(data) {
                lambda(data);
            },
            error: function(s, error) {
                _staticApi.onApiError.apply(error);
            }
        });

        previous_requests[endpoint] = xhttp;
        return xhttp;
    }

    _staticApi.get_streams_by_location = function(north, east, south, west, start, end, lambda)
    {
        var params = 'topleft=' + north + '&topleft=' + east + '&bottomright=' + south + '&bottomright=' + west + '&start=' + start + '&end=' + end;

        _staticApi.call('get/streambylocation', params, function(data){
            Log('debug', 'Stream data recieved: ', data.data.streams);
            lambda(data.data.streams);
        });
    }

    _staticApi.login = function(username, password, lambda)
    {
         var params = 'username=' + username + '&password=' + password

         //This will return a token if login succeeded
        _staticApi.call('login', params, function(data){
            Log('debug', 'response data:', data.data);
            lambda(data.data);
        })
    }

    _staticApi.register = function(username, password, lambda)
    {
         var params = 'username=' + username + '&password=' + password

         //This will return a token
        _staticApi.call('register', params, function(data){
            Log('debug', 'response data:', data.data);
            lambda(data.data);
        })
    }

    _staticApi.update_object_by_key = function(obj, key, paramsDict, lambda)
    {
        var params = '';

        for (var key in paramsDict){
            if (arr.hasOwnProperty(k)) {
                params = params + key + '=' + paramsDict[key] + '&'
            }
        }
        //Requires a token
        _staticApi.call(('update/' + obj + '/' + key), params, function(data){
            Log('debug', 'response data:', data.data);
            lambda(data.data);
        })
    }

    _staticApi.delete_object_by_key = function(obj, key, paramsArr, lambda)
    {
        var params = '';

        for (var key in paramsArr){
            params = paramsArr[key] + '&'
        }
        //Requires a token
        _staticApi.call(('delete/' + obj + '/' + key), params, function(data){
            Log('debug', 'response data:', data.data);
            lambda(data.data);
        })
    }

    _staticApi.get_object_by_key = function(obj, key, lambda)
    {
         var params = null

        _staticApi.call(('get/' + obj + "/" + "key"), params, function(data){
            Log('debug', 'response data:', data.data);
            lambda(data.data);
        })
    }

    _staticApi.get_object_by_secondary_key = function(obj, secondary, key, lambda)
    {
         var params = null

        _staticApi.call(('get/' + obj + "by" + secondary + "/" + key), params, function(data){
            Log('debug', 'response data:', data.data);
            lambda(data.data);
        })
    }

    //Deprecated
    _staticApi.get_stream_by_stream_id = function(id, lambda)
    {
        var params = 'streamid=' + id;

        _staticApi.call('getstreambystreamid', params, function(data){
            Log('debug', 'Stream data for ' + id + ': ', data.data);
            lambda(data.data);
        })
    }

    return _staticApi;
})