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