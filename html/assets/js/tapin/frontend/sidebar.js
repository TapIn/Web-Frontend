define(['jquery', 'tapin/frontend/player', 'tapin/util/log'], function(JQuery, Player, Log){
    return function(elem){
        var _this = this;
        this.player = null;

        var constructor = function(elem){
            Log('debug', 'Init sidebar');
            var playerElem = JQuery('<div id="player"></div>');
            _this.player = new Player(playerElem);
            JQuery(elem).append(playerElem);
        }

        constructor(elem);
    }
});