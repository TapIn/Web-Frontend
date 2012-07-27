define([], function(){
    return new (function(){
        var _this = this;
        this.save = function(key, value)
        {
            value = JSON.stringify(value);

            if (typeof(localStorage) === 'undefined') {
                write_cookie(key, value, 90);
            } else {
                localStorage[key] = value;
            }
        }

        this.has = function(key)
        {
            var result = _this.read(key);
            return typeof(result) !== 'undefined' && result !== null;
        }

        this.read = function(key)
        {
            if (typeof(localStorage) === 'undefined') {
                value = read_cookie(key);
            } else {
                try {
                    value = localStorage[key];
                } catch (err) {
                    value = undefined; // ie8 fix
                }
            }

            if (typeof(value) === 'undefined' || value === null)
            {
                return null;
            }

            try{
                return JSON.parse(value);
            }catch(e){
                _this.erase(key);
                return null;
            }
        }

        this.erase = function(key)
        {
            if (!_this.has(key)) {
                return;
            }

            if (typeof(localStorage) === 'undefined') {
                erase_cookie(name);
            } else {
                localStorage.removeItem(key);
            }
        }

        var erase_cookie = function(name)
        {
            createCookie(name,"",-1);
        }

        var write_cookie = function(name, value, days)
        {
                if (days) {
                    var date = new Date();
                    date.setTime(date.getTime()+(days*24*60*60*1000));
                    var expires = "; expires="+date.toGMTString();
                }
                else var expires = "";
                document.cookie = name+"="+value+expires+"; path=/";
        }

        var read_cookie = function(name)
        {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }
    })();
})