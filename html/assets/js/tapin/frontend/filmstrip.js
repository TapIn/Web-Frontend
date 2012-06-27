define(['tapin/util/async'], function(Async) {
    return function(elem, image, dimensions, frames, speed) {

        var _elem = null;
        var _speed = null;
        var _initialPos = [];

        var isInStandardPosition = function(){
            var pos = getCurrentPosition();
            return (pos[0] == _initialPos[0]) && (pos[1] == _initialPos[1]);
        }

        var getRawPosition = function(pos) {
            return pos.substring(0, pos.length - 2);
        }

        var getCurrentPosition = function() {
            return [getRawPosition(_elem.css('background-position-x')), getRawPosition(_elem.css('background-position-y'))];
        }

        /**
         * Hides the filmstrip when displaying its first frame
         */
        this.hide = function() {
            Async.poll(_speed, isInStandardPosition, function(){
                _elem.addClass('hidden');
            });
        }

        /**
         * Shows the filmstrip when displaying its first frame
         */
        this.show = function() {
            Async.poll(_speed, isInStandardPosition, function(){
                _elem.removeClass('hidden');
            });
        }

        /**
         * Initializes a filmstrip
         * @param  jQuery   elem       The element to convert to a filmstrip
         * @param  string   image      Image URL to use for the filmstrip
         * @param  array    dimensions Dimensions of the filmstrip [x, y]
         * @param  array    frames     Number of frames in the filmstrip [x, y]. Either x or y must be 0.
         * @param  float    speed      Seconds between frames
         */
        this.constructor = function(elem, image, dimensions, frames, speed) {
            _elem = elem;
            _elem.css('background-image', "url('" + image + "')");
            _elem.css('background-position-x', '0px');
            _elem.css('background-position-y', '0px');
            _speed = speed;

            if (typeof(dimensions) !== 'object') {
                dimensions = [dimensions, dimensions];
            }

            if (typeof(frames) !== 'object') {
                frames = [frames, 1];
            }

            if (typeof(speed) === 'undefined') {
                speed = 50;
            }

            var frameSize = [Math.floor(dimensions[0] / frames[0]), Math.floor(dimensions[1] / frames[1])];

            _elem.css('width', frameSize[0]);
            _elem.css('height', frameSize[1]);

            _initialPos = getCurrentPosition();

            Async.every(speed, function(){
                var previous_location = getCurrentPosition();

                var new_location = [
                    (previous_location[0] - frameSize[0]) % dimensions[0],
                    (previous_location[1] - frameSize[1]) % dimensions[1]
                ];

                _elem.css('background-position-x', new_location[0] + 'px');
                _elem.css('background-position-y', new_location[1] + 'px');
            });
        }

        this.constructor(elem, image, dimensions, frames, speed);
    }
});