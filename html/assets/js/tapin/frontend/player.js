define([], function(){
    return function(div)
    {
        var _this = this;
        var _player = null;
        var _player_div = null;

        this.getPlayer = function(){return _player;}

        this.playLive = function(server, uri)
        {
            init_player({
                provider: 'rtmp',
                netConnectionUrl: server,
                url: uri
            })
        }

        this.play = function(uri)
        {
            init_player({
                url: uri
            })
        }

        var init_player = function(clip)
        {
            _player = $f(_player_div, "assets/swf/flowplayer-3.2.11.swf", {
                clip: clip,
                plugins: {
                    rtmp: {
                        url: "flowplayer.rtmp-3.2.10.swf"
                    },
                    controls: null
                }
            });
        }

        var constructor = function(div)
        {
            if (div instanceof jQuery) {
                div = div[0];
            }

            _player_div = div.appendChild(document.createElement('div'));
        }
        constructor(div);
    }
});