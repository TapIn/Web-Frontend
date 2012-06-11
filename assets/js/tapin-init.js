window.TapIn = {
    Frontend: {},
    Util: {}
};

TapIn.Log = function(level, message)
{
    level = level.toUpperCase();
    context = [];
    Array.prototype.push.apply( context, arguments );
    context.shift();
    context.shift();
    context = JSON.stringify(context);

    if (typeof(console) !== 'undefined') {
        console.log(level + ": " + message, context);
    }


    if (typeof(context) !== 'undefined') {

    }
}

TapIn.Util.callUserFuncArray = function (delegate, parameters) {
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

TapIn.Util.randomString = function (length) {
    var result, chars;
    result = "";
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
    while (length > 0) {
        result += chars.charAt(Math.min(Math.floor(Math.random() * chars.length)));
        length--;
    }
    return result;
};

TapIn.Util.random = function(min, max)
{
    if (min > max) {
        var tmp = max;
        max = min;
        min = tmp;
    }
    return Math.random() * (max - min) + min;
}

TapIn.Util.Async = new (function()
{
    var delegates = {};

    var getId = function(milli) {
        return (new Date()) + "+" + milli + "-" + Math.floor(Math.random());
    }

    /**
     * Executes a callback later
     * @param  int      milli    Milliseconds until execution
     * @param  function delegate The function to execute when the timeout expires
     */
    this.later = function(milli, delegate) {
        var id = getId(milli);
        delegates[id] = delegate;
        setTimeout("TapIn.Util.Async.returningLater(\"" + id + "\")", milli);
    };

    /**
     * Repeats a callback
     * @param  int      milli    Milliseconds between execution
     * @param  function delegate The function to execute
     */
    this.every = function(milli, delegate) {
        var id = getId(milli);
        delegates[id] = delegate;
        setInterval("TapIn.Util.Async.returningLater(\"" + id + "\", true)", milli);
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
    };

    this.returningLater = function(id, noGc) {
        delegates[id]();
        if(typeof(noGc) !== undefined && !noGc) {
            delegates[id] = null;
        }
    };
})();