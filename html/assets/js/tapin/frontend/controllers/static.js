define(['jquery', 'documentcloud/backbone', 'tapin/frontend', 'tapin/util/log'], function(JQuery, Backbone, Frontend, Log)
{
    // And now the controller:
    var app = new (Backbone.Router.extend(new function(){
        this.routes = {
            'page/*path': 'showPage'
        }

        this.initialize = function(){
           JQuery(window).bind('hashchange', function(){
                Frontend.closeModalPage();
                Frontend.updateNav('');
            })
        }

        this.showPage = function(path)
        {
            Log('debug', 'Changing page to ' + path);
            JQuery.ajax({
                cache: false,
                url: 'assets/static/' + path + '?nocache=' + (new Date()).getTime(),
                dataType: 'html',
                success: function(html){
                    Frontend.showModalPage(html);
                    Frontend.updateNav('#page/' + path);
                }
            })
        }
    }));

    return app;
});