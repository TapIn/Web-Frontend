/**
 * Helper methods
 *
 * @static
 */
define([], function(){
    return new (function(){
        /**
         * Calls a fucntion, passing in an array of values as position-wise arguments
         * e.g. callUserFuncArray(lambda, [1, 2, 3, 'a', 'b', 'c']) calls lambda(1, 2, 3, 'a', 'b', 'c');
         * @param  callable delegate   Function to execute
         * @param  array    parameters Paramaters to pass to the function
         * @return mixed               Result of the function
         */
        this.callUserFuncArray = function (delegate, parameters) {
            var func;

            if (typeof delegate === 'string') {
                func = (typeof this[delegate] === 'function') ? this[delegate] : func = (new Function(null, 'return ' + delegate))();
            }
            else if (Object.prototype.toString.call(delegate) === '[object Array]') {
                func = (typeof delegate[0] == 'string') ? eval(delegate[0] + "['" + delegate[1] + "']") : func = delegate[0][delegate[1]];
            }
            else if (typeof delegate === 'function') {
                func = delegate;
            }

            if (typeof func !== 'function') {
                throw new Error(func + ' is not a valid function');
            }

            return (typeof delegate[0] === 'string') ? func.apply(eval(delegate[0]), parameters) : (typeof delegate[0] !== 'object') ? func.apply(null, parameters) : func.apply(delegate[0], parameters);
        }

        /**
         * Generates a random string with alphanumeric characters, as well as '-' and '_'
         * @param  float    length Length of the string to generate
         * @return string          Random string
         */
        this.randomString = function (length) {
            var result, chars;
            result = "";
            chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
            while (length > 0) {
                result += chars.charAt(Math.min(Math.floor(Math.random() * chars.length)));
                length--;
            }
            return result;
        }

        this.shuffle = function(o)
        {
            for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }

        this.minimize = function()
        {
            var min = null;
            for (var i in arguments) {
                var arg = arguments[i];
                if (min === null || arg < min) {
                    min = arg;
                }
            }

            return min;
        }

        /**
         * Generates a random float in the range
         * @param  float    min Min value
         * @param  float    max Max value
         * @return float        Random value
         */
        this.random = function(min, max)
        {
            if (min > max) {
                var tmp = max;
                max = min;
                min = tmp;
            }
            return Math.random() * (max - min) + min;
        }
    })();
})