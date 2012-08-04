define(['jquery', 'documentcloud/backbone', 'tapin/frontend', 'tapin/util/log', 'tapin/api'], function(JQuery, Backbone, Frontend, Log, Api)
{
    // And now the controller:
    var app = new (Backbone.Router.extend(new function(){
        this.routes = {
            'video/:id/': 'showVideo',
            'video/:id': 'showVideo',
            'video/:id/:time': 'showVideoAtTime'
        }

        /**
         * Shows the video if currently streaming, otherwise shows the recorded video
         * @param  string   id Stream ID
         */
        this.showVideo = function(id)
        {
            Log('debug', 'Showing video at closest time from ' + id);
            this.showVideoAtTime(id, 'now');
            this.centerMapOnVideo(id);
        }

        /**
         * Shows the video at the specified time
         * @param  string   id   Stream ID
         * @param  string   time Time to display the stream at
         */
        this.showVideoAtTime = function(id, time)
        {
            if(!isNaN(time) && window.fe.externalLink){
                var start = new Date(time*1000-259200000);
                var end = new Date(time*1000+259200000);
                 $('#datepicker-invisible').text(start.getDate() + '/' + start.getMonth() + '/' + start.getFullYear() + '|' + 
                        end.getDate() + '/' + end.getMonth() + '/' + end.getFullYear());
                $('#datepicker-calendar').DatePickerSetDate([start, end], true);
                $('#date-range-field span').text(start.getDate()+' '+start.getMonthName(true)+', '+start.getFullYear()+' - '+
                                    end.getDate()+' '+end.getMonthName(true)+', '+end.getFullYear());
            } 
            Log('debug', 'Showing video from ' + id + '@' + time + 's');
            Frontend.showVideo(id);
            this.centerMapOnVideo(id);

        }

        this.centerMapOnVideo = function(id)
        {
            Api.get_timestream_by_stream_id(id, function(data){
                Log('debug', "Centering video: ", data[0][1].coord[0]);
                Frontend.mainMap.initCenter(data[0][1].coord[0], data[0][1].coord[1], 16);
            }, true);
        }
    }));
});