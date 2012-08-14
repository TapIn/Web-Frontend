define(['flowplayer', 'tapin/util/log', 'jquery'], function(Flowplayer, Log, JQuery){
    return function(div)
    {
        var _this = this;
        var _player = null;
        var player_div = null;

        this.getPlayer = function(){return _player;}

        /**
         * Plays a live stream
         * @param  string   server    Hostname of the server hosting the stream
         * @param  string   stream_id ID of the stream
         */
        this.playLive = function(server, stream_id)
        {
            Log('debug', 'Playing live');
            mixpanel.track('play', {type: 'live', 'stream_id': stream_id});
            init_player({
                provider: 'rtmp',
                netConnectionUrl: 'rtmp://' + server + '/live/' + stream_id,
                url: 'stream',
                isLive: true,
                streamId: stream_id
            })
        }

        /**
         * Plays a recorded live stream
         * @param  string   stream_id ID of the stream
         */
        this.playRecordedLive = function(stream_id)
        {
            Log('debug', 'Playing recorded');
            mixpanel.track('play', {type: 'recorded', 'stream_id': stream_id});
            init_player({
                provider: 'http',
                url: 'http://content.tapin.tv/' + stream_id + '/stream.mp4',
                isLive: false,
                streamId: stream_id
            });
        }

        /**
         * Starts the player based on stream data
         * @param  object   stream_data Stream data to use
         */
        this.playStreamData = function(stream_data)
        {
            if (stream_data.streamend == 0) {
                this.playLive(stream_data.host, stream_data.streamid);
            } else {
                this.playRecordedLive(stream_data.streamid);
            }
        }

        var _volume = 80;
        var _isMuted = false;
        /**
         * Mutes the player
         */
        this.mute = function()
        {
            _player.setVolume(0);
        }

        /**
         * Returns the player to its volume before mute was called
         */
        this.unmute = function()
        {
            _player.setVolume(_volume);
        }

        /**
         * Sets the volume of the player
         * @param float    volume The new volume of the player, from 0 to 100
         */
        this.setVolume = function(volume)
        {
            _volume = volume;
            _player.setVolume(_volume);
        }

        /**
         * Gets the current volume of the player
         * @return float   The current volume of the player
         */
        this.getVolume = function()
        {
            return (_isMuted? 0 : _volume);
        }

        var init_player = function(clip)
        {
            $("#controls-flow").html('');
            Log('debug', 'Starting flowplayer');
            _player = Flowplayer(player_div[0]  , {
                src: 'assets/swf/flowplayer.commercial-3.2.11.swf',
                wmode: 'opaque'
            }, {
                key: '#$671186fa04a44f30376',
                onBeforePause: function() {
                    return true;
                },
                onBegin: function () {
                    this.setVolume(_this.getVolume());
                },
                onFinish: function() {
                    return false;
                },
                onError: function() {
                    Log('error', 'Could not play ' + (clip.isLive? 'live' : 'recorded') + ' stream', clip);
                    if (clip.isLive) {
                        _this.playRecordedLive(clip.streamId);
                    } else {
                        player_div.html('<img src="assets/img/viderror.png" />');
                        mixpanel.track('broken-stream', {'url': clip.url});
                    }
                },
                onEnded: null,
                clip: clip,
                play: {
                    label: 'Start',
                    replayLabel: 'Replay'
                },
                plugins: {
                    rtmp: {
                        url: "flowplayer.rtmp-3.2.10.swf"
                    },
                    controls: null
                },

                canvas: {
                        background: '#B70600 no-repeat 30 10',
                        backgroundGradient: 'none'
                }
            }).controls('controls-flow');

            $('#controls').append($('#volume'));
            $('#controls').append($('#upvote'));
            $('#controls').append($('#downvote'));

        }

        var constructor = function(div)
        {
            player_div = JQuery('<div id="player"></div>');
            $('#player-container').html(player_div)
            // init_player(null);

        }
        constructor(div);
    }
});