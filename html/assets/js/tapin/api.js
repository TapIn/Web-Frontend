define(['tapin/util/log', 'tapin/util/event', 'jquery'], function(Log, Event, JQuery){
    var _staticApi = function()
    {
        var _this = this;
        var previous_requests = {};
    }

    var previous_requests = {};
    _staticApi.base = "http://stage.api.tapin.tv/web/";

    _staticApi.onApiError = new Event();

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

        _staticApi.call('getstreamsbylocation', params, function(data){
            Log('debug', 'Stream data recieved: ', data.data.streams);
            lambda(data.data.streams);
        });
    }

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