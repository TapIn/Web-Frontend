define([], function()
{
    return new (function(){
        var _this = this;

        /**
         * Executes a callback later
         * @param  int      milli    Milliseconds until execution
         * @param  function delegate The function to execute when the timeout expires
         */
        this.later = function(milli, delegate) {
            return setTimeout(delegate, milli);
        }

        /**
         * Repeats a callback
         * @param  int      milli    Milliseconds between execution
         * @param  function delegate The function to execute
         */
        this.every = function(milli, delegate) {
            setInterval(delegate, milli);
        }

        /**
         * Checks periodically for a condition to be true, then executes a callback
         * @param  int      milli     The number of seconds to wait between checks
         * @param  function condition A function which returns true when the delegate should execute
         * @param  function delegate  Function to execute when condition is true
         */
        this.poll = function(milli, condition, delegate) {
            var lambda = function(){
                if(condition()) {
                    delegate();
                } else {
                    _this.later(milli, lambda);
                }
            };
            lambda();
        }
    })();
});