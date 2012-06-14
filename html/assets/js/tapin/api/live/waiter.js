define(['tapin/util', 'jquery'], function(Util, JQuery){
    return function(success_lambda, failure_lambda)
    {
        var xhr = null;
        var endpoint = "http://live.api.tapin.tv/";


        var constructor = function(success_lambda, failure_lambda)
        {
            xhr = JQuery.ajax({
                url: endpoint . '?random=' + Util.randomString(),
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
})