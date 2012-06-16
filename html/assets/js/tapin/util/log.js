define(['tapin/config'], function(Config){
    return function(level, message)
    {
        levels = {
            all: 0,
            debug: 1,
            info: 2,
            warn: 3,
            error: 4,
            fatal: 5
        };
        level = level.toUpperCase();

        if (levels[level.toLowerCase()] >= levels[Config.logs.level.toLowerCase()]) {
            context = [];
            Array.prototype.push.apply( context, arguments );
            context.shift();
            context.shift();
            context = JSON.stringify(context);

            if (typeof(console) !== 'undefined') {
                console.log(level + ": " + message, context);
            }

            if (Config.logs.send === true) {
                // TODO: Send errors
            }
        }
    }
});