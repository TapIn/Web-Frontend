define(['jquery', 'documentcloud/backbone', 'tapin/frontend'], function(JQuery, Backbone, Frontend)
{
    // And now the controller:
    var app = new (Backbone.Router.extend(new function(){
        this.routes = {
            'map/:time': 'showMap'
        }

        /**
         * Shows the map at the specified time
         * @param  string   time Time to display the map at
         */
        this.showMap = function(time)
        {
            Frontend.timeslider.selectTime(time);
        }
    }));

    Frontend.timeslider.onTimeChange.register(function(time, name){
        // TODO: We need to get some sort of subroutes before this will work well.
    })
});