define(['jquery', 'documentcloud/backbone', 'tapin/frontend', 'tapin/util/log', 'tapin/api', 'tapin/user', 'tapin/util/async'],
       function(JQuery, Backbone, Frontend, Log, Api, User, Async)
{
    // And now the controller:
    var app = new (Backbone.Router.extend(new function(){
        _this = this;
        this.routes = {
            'user/*username': 'showPage'
        }

        this.initialize = function(){
           JQuery(window).bind('hashchange', function(){
                Frontend.userModal.hide();
            })
        }

        /**
         * Shows a user page
         * @param  string   username Username to display a page for
         */
        this.showPage = function(username)
        {
            Log('debug', 'Showing user page ' + username);
            JQuery.ajax({
                url: 'assets/templates/userprofile.html',
                cache: false,
                success: function(html) {
                    Api.get_object_by_key('user', username, function(userdata) {
                        Log('info', 'Showing user modal for ' + username);
                        userdata.username = username;
                        var u = new User(userdata);
                        Frontend.userModal.show(html, u);
                    }, true);
                },
                error: function(s, err) {
                    Log('error', "Couldn't get user page template, retrying!");
                    Async.later(5000, function(){
                        _this.showPage(username);
                    });
                }
            });
        }
    }));

    return app;
});