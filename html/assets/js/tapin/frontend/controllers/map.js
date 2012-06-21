define(['jquery', 'documentcloud/backbone', 'tapin/frontend'], function(JQuery, Backbone, Frontend)
{
    // And now the controller:
    var app = new (Backbone.Router.extend(new function(){
        this.routes = {
            'map/:time': 'showMap'
        }

        this.showMap = function(time)
        {
            Frontend.timeslider.selectTime(time);
        }
    }));

    Frontend.timeslider.onTimeChange.register(function(time, name){
        // TODO: We need to get some sort of subroutes before this will work well.
    })
});