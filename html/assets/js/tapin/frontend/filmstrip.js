define(['tapin/util/async'], function(Async) {
    return function(elem, image, dimensions, frames, speed) {

        var _elem = null;
        var _speed = null;
        var _initialPos = [];

        var isInStandardPosition = function(){
            var pos = getCurrentPosition();
            return ([pos[0], pos[1]] == [_initialPos[0], _initialPos[1]]);
        }

        this.hide = function() {
            Async.poll(_speed, isInStandardPosition, function(){
                _elem.addClass('hidden');
            });
        }

        this.show = function() {
            Async.poll(_speed, isInStandardPosition, function(){
                _elem.removeClass('hidden');
            });
        }

        var getRawPosition = function(pos) {
            return pos.substring(0, pos.length - 2);
        }

        var getCurrentPosition = function() {
            return [getRawPosition(elem.css('background-position-x')), getRawPosition(elem.css('background-position-y'))];
        }

        this.constructor = function(elem, image, dimensions, frames, speed) {
            _elem = elem;
            _speed = speed;

            console.log(_elem);

            _initialPos = getCurrentPosition();

            if (typeof(dimensions) !== 'array') {
                dimensions = [dimensions, dimensions];
            }

            if (typeof(frames) !== 'array') {
                frames = [frames, 1];
            }

            if (typeof(speed) === 'undefined') {
                speed = 50;
            }

            var frameSize = [dimensions[0] / frames[0], dimensions[1] / frames[1]];

            Async.every(speed, function(){
                var previous_location = getCurrentPosition();

                var new_location = [
                    (previous_location[0] - frameSize[0]) % frames[0],
                    (previous_location[1] - frameSize[1]) % frames[1]
                ];

                preloader.css('background-position-x', new_location[0] + 'px');
                preloader.css('background-position-y', new_location[0] + 'px');
            });
        }

        this.constructor(elem, image, dimensions, frames, speed);
    }
});