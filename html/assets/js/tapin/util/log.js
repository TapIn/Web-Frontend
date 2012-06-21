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
        var loglevel = levels[level.toLowerCase()];

        if (loglevel >= levels[Config.logs.level.toLowerCase()]) {
            context = [];
            Array.prototype.push.apply( context, arguments );
            context.shift();
            context.shift();

            if (context.length == 0) {
                context = undefined;
            }

            if (typeof(console) !== 'undefined') {
                var log_message = "[" + level + "] " + message;
                if (loglevel >= 4) {
                    console.error(log_message, context);
                } else if(loglevel >= 3) {
                    console.warn(log_message, context);
                } else if(loglevel >= 2) {
                    console.log(log_message, context);
                } else {
                    console.debug(log_message, context);
                }
            }

            if (Config.logs.send === true) {
                // TODO: Send errors
            }
        }
    }
});