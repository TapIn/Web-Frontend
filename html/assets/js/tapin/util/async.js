define([], function()
{
    var delegates = {};

    var getId = function(milli) {
        return (new Date()) + "+" + milli + "-" + Math.floor(Math.random());
    }

    var returningLater = function(id, noGc) {
        return function(){
            delegates[id]();
            if(typeof(noGc) !== undefined && !noGc) {
                delegates[id] = null;
            }
        }
    }

    /**
     * Executes a callback later
     * @param  int      milli    Milliseconds until execution
     * @param  function delegate The function to execute when the timeout expires
     */
    this.later = function(milli, delegate) {
        var id = getId(milli);
        delegates[id] = delegate;
        setTimeout(returningLater(id), milli);
    }

    /**
     * Repeats a callback
     * @param  int      milli    Milliseconds between execution
     * @param  function delegate The function to execute
     */
    this.every = function(milli, delegate) {
        var id = getId(milli);
        delegates[id] = delegate;
        setInterval(returningLater(id, true), milli);
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
                this.later(milli, lambda);
            }
        };
        lambda();
    }
});