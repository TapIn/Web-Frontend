define(['tapin/api', 'jquery', 'tapin/util/async'], function(Api, JQuery, Async){
    return function(elem)
    {
        var template;
        var _elem;
        this.user = null;
        var last_stream_id = null;
        var _this = this;

        this.constructor = function(elem)
        {
            _elem = JQuery(elem);
            _elem.html('');
            JQuery.ajax({
                cache: false,
                url: 'assets/templates/comments.html?nocache=' + (new Date()).getTime(),
                dataType: 'html',
                success: function(html){
                    template = Handlebars.compile(html);
                }
            });

            Async.every(10000, function(){
                if (last_stream_id !== null) {
                    _this.updateCommentsFor(last_stream_id);
                }
            });
        }

        this.updateCommentsFor = function(stream_id)
        {
            last_stream_id = stream_id;
            var onUpdatedComments = function(data)
            {
                var comments = [];

                var sortable = [];
                for (var i in data)
                    sortable.push([i, data[i]])
                sortable.sort(function(a, b) {return a[1][1]['timestamp'] - b[1][1]['timestamp']})

                sortable.reverse();

                for (var i in sortable)
                {
                    var newDate = new Date();
                    newDate.setTime( sortable[i][1][1]['timestamp']*1000);

                    var comment = sortable[i][1][1];
                    comment.id = sortable[i][1][0];
                    comment.time = jQuery.timeago(newDate);
                    comments.push(comment);
                }
                var _data = {
                    comments: comments
                };
                if (data.length > 0)
                {
                    var new_html = template(_data);
                    _elem.html(new_html);
                } else {
                    _elem.html('No comments.');
                }
            }

            Api.get_comments_by_streamid(stream_id, onUpdatedComments);
        }

        this.constructor(elem);
    }
})