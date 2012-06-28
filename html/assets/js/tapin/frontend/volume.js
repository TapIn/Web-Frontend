define(['jquery', 'tapin/util/log', 'tapin/util/event'], function(JQuery, Log, Event){
    return function(elem){
        var _this = this;
        var _elem = null;
        this.player = null;

        this.onVolumeChange = new Event();
        this.onMute = new Event();
        this.onUnmute = new Event();

        var _volume = 100;
        var isMuted = false;
        /**
         * Mutes the player
         */
        this.mute = function()
        {
            _volume = 0;
            this.onMute.apply();
            isMuted = true;
        }

        /**
         * Returns the player to its volume before mute was called
         */
        this.unmute = function()
        {
            this.onUnmute.apply(_volume);
            isMuted = false;
        }

        /**
         * Sets the volume of the player
         * @param float    volume The new volume of the player, from 0 to 100
         */
        this.setVolume = function(volume)
        {
            _volume = volume;
            this.onVolumeChange.apply(volume);
        }

        /**
         * Returns the volume of the player
         * @return float   The volume of the player, from 0 to 100
         */
        this.getVolume = function()
        {
            return (isMuted? 0 : _volume);
        }

        var onBarClickFunction = function(vol)
        {
            return function() {
                _elem.children('.active').each(function(){
                    $(this).removeClass('active');
                });

                $(this).addClass('active');

                _this.setVolume(vol);
            }
        }

        var constructor = function(elem){
            Log('debug', 'Init volume');
            _elem = elem;

            for (var i = 0; i <= 10; i++) {
                var bar = JQuery('<div class="bar bar-' + i + ( i == 8? ' active' : '') + '"></div>').click(onBarClickFunction(i * 10));
                _elem.append(bar);
            }

            _this.setVolume(60);
        }

        constructor(elem);
    }
});