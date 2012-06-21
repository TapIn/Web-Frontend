define(['jquery', 'documentcloud/backbone', 'tapin/frontend', 'tapin/util/log'], function(JQuery, Backbone, Frontend, Log)
{
    // And now the controller:
    var app = new (Backbone.Router.extend(new function(){
        this.routes = {
            'user/*username': 'showPage'
        }

        this.initialize = function(){
           JQuery(window).bind('hashchange', function(){
                Frontend.modal.hide();
                Frontend.updateNav('');
            })
        }

        this.showPage = function(username)
        {
            Log('debug', 'Showing user page ' + username);
            
        }
    }));

    return app;
});