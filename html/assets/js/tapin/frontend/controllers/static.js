define(['jquery', 'documentcloud/backbone', 'tapin/frontend'], function(JQuery, Backbone, Frontend)
{
    // And now the controller:
    var app = new (Backbone.Router.extend(new function(){
        this.routes = {
            'page/*path': 'showPage'
        }

        this.showPage = function(path)
        {
            JQuery.ajax({
                url: 'assets/static/' + path,
                dataType: 'html',
                success: function(html){
                    Frontend.showModalPage(html, function(){
                        app.navigate('map/' + Frontend.timeslider.getCurrentTime());
                    });
                }
            })
        }
    }));

    Frontend.timeslider.onTimeChange.register(function(time, name){
        app.navigate('map/' + name);
    });
});