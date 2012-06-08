TapIn.Event = function()
{
    var _delegates = [];
    this.register = function(delegate)
    {
        _delegates.push(delegate);
    }

    this.deregister = function(delegate)
    {
        for (var i in _delegates) {
            if (_delegates[i] == delegate) {
                _delegates.splice(i, 1);
            }
        }
    }

    this.apply = function()
    {
        for (var i in _delegates) {
            TapIn.Util.callUserFuncArray(_delegates[i], arguments);
        }
    }
}