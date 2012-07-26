define(['jquery', 'tapin/util/log', 'tapin/util', 'tapin/util/async'], function(JQuery, Log, Util, Async) {
    return function(elem)
    {
        var _this = this;
        var _elem = null;

        var _ids = [];
        var lastUpdate;
        this.commitUpdate = function()
        {
            if (typeof(lastUpdate) !== 'undefined' && ((new Date()).getTime() - lastUpdate.getTime()) / 1000 < 10) {
                Log('debug', 'Last thumb update was ' + ((new Date()).getTime() - lastUpdate.getTime()) / 1000 + ' seconds ago, skipping...');
                _ids = [];
                return;
            }

            Log('debug', 'Updating thumbs!');

            lastUpdate = new Date();
            var groups = [];
            var lastFocused = _elem.children('.item').index(_elem.children('.item .active'));
            if (lastFocused < 0) {
                lastFocused = 0;
            }

            for (var i in _ids) {
                var groupID = Math.floor(i / 3);
                if (typeof(groups[groupID]) === 'undefined') {
                    groups[groupID] = [];
                }
                groups[groupID].push(_ids[i]);
            }

            var html = '';
            for (var i in groups) {
                var active = '';
                if (i == lastFocused) {
                    active = ' active';
                }

                var groupHtml = '<div class="item' + active + '">';
                for (var j in groups[i]) {
                    var url = 'http://thumbs.tapin.tv/' + groups[i][j] + '/144x107/latest.jpg?noCache=' + Util.randomString(30);
                    var itemHtml = '<a href="#video/' + groups[i][j] + '/now"><img src="' + url + '" /></a>'
                    groupHtml += itemHtml;
                }
                groupHtml += '</div>';

                html += groupHtml;
            }

            var temp = _elem.clone();
            _elem.after(temp);
            temp.css('position', 'absolute');
            temp.css('background', $('#sidebar').css('background'));
            temp.offset(_elem.offset());

            _elem.html(html);

            // Give the new images time to load...
            Async.later(1000, function(){
                temp.remove();
            });
            _ids = [];
        }

        this.addVideo = function(id)
        {
            _ids.push(id);
        }

        this.constructor = function(elem)
        {
            elem.html('');
            _elem = $('<div class="carousel-inner"></div>');
            elem.append(_elem);
            elem.append($('<a class="carousel-control left" href="#myCarousel" data-slide="prev"><p>‹</p></a><a class="carousel-control right" href="#myCarousel" data-slide="next"><p>›</p></a>'));
        }
        this.constructor(elem);
    }
})