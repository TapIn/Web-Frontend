define(['jquery', 'documentcloud/backbone', 'tapin/frontend', 'tapin/util/log'], function(JQuery, Backbone, Frontend, Log)
{
    // And now the controller:
    var app = new (Backbone.Router.extend(new function(){
        this.routes = {
            'video/:id/': 'showVideoOrClosest',
            'video/:id': 'showVideoOrClosest',
            'video/:id/:time': 'showVideo'
        }

        this.showVideoOrClosest = function(id)
        {
            Log('debug', 'Showing video at closest time from ' + id);
            this.showVideo(id, 'now');
        }

        this.showVideo = function(id, time)
        {
            Log('debug', 'Showing video from ' + id + '@' + time + 's');
            Frontend.showVideo(id);
        }
    }));
});