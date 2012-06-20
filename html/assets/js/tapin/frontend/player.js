define(['flowplayer', 'tapin/util/log', 'jquery'], function(Flowplayer, Log, JQuery){
    return function(div)
    {
        var _this = this;
        var _player = null;
        var player_div = null;

        this.getPlayer = function(){return _player;}

        this.playLive = function(server, uri)
        {
            Log('debug', 'Playing live');
            mixpanel.track('play-live');
            init_player({
                provider: 'rtmp',
                netConnectionUrl: server,
                url: uri
            })
        }

        this.play = function(uri)
        {
            mixpanel.track('play-dvr');
            init_player({
                url: uri
            })
        }

        var _volume = 0;
        this.mute = function()
        {
            _player.setVolume(0);
        }

        this.unmute = function()
        {
            _player.setVolume(_volume);
        }

        this.setVolume = function(volume)
        {
            _volume = volume;
            _player.setVolume(_volume);
        }

        var init_player = function(clip)
        {
            Log('debug', 'Starting flowplayer');
            _player = Flowplayer(player_div[0], "assets/swf/flowplayer.commercial-3.2.11.swf", {
                key: '#$671186fa04a44f30376',
                onBeforePause: function() {
                    return false;
                },
                onBegin: function () {
                    this.setVolume(_volume);
                },
                onFinish: function() {
                    return false;
                },
                onEnded: null,
                clip: clip,
                plugins: {
                    rtmp: {
                        url: "flowplayer.rtmp-3.2.10.swf"
                    },
                    controls: null,
                },
                canvas: {
                        background: '#B70600 no-repeat 30 10',
                        backgroundGradient: 'none'
                }
            });
        }

        var constructor = function(div)
        {
            player_div = JQuery('<div style="width:100%;height:100%"></div>');
            $(div).append(player_div);
        }
        constructor(div);
    }
});