define(['jquery', 'documentcloud/backbone', 'tapin/api', 'tapin/user', 'tapin/util/async'],
       function(JQuery, Backbone, Api, User, Async)
{
    // And now the controller:
    var app = new (Backbone.Router.extend(new function(){
        _this = this;
        this.routes = {
            'profile/:username': 'showPage',
            'user/:username': 'showPage'
        }

        /**
         * Shows a user page
         * @param  string   username Username to display a page for
         */
        this.showPage = function(username)
        {
            JQuery.ajax({
                url: 'assets/templates/mobile/userprofile.html',
                cache: false,
                success: function(html) {
                    Api.get_object_by_key('user', username, function(userdata) {
                        userdata.username = username;
                        var u = new User(userdata);
                        var template = Handlebars.compile(html);
                        JQuery('#canvas').html(template(u));
                    }, true);
                },
                error: function(s, err) {
                    Async.later(2000, function(){
                        _this.showPage(username);
                    });
                }
            });
        }
    }));

    return app;
});