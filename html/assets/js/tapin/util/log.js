define([], function(){
    return function(level, message)
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
});