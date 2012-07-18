define(['tapin/api', 'jquery'], function(Api, JQuery){
    return function(elem)
    {
        var template;
        var _elem;
        this.user = null;
        var _this = this;

        this.constructor = function(elem)
        {
            _elem = JQuery(elem);
            JQuery.ajax({
                cache: false,
                url: 'assets/templates/comments.html?nocache=' + (new Date()).getTime(),
                dataType: 'html',
                success: function(html){
                    template = Handlebars.compile(html);
                }
            })
        }

        this.updateCommentsFor = function(stream_id)
        {
            var onUpdatedComments = function(data)
            {
                var _data = {
                    user: _this.user,
                    comments: data
                };
                var new_html = template(_data);
                _elem.html(new_html);
            }

            Api.get_comments_by_streamid(stream_id, onUpdatedComments);
        }

        this.constructor(elem);
    }
})