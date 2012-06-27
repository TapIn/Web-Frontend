define(['jquery', 'tapin/util/event', 'tapin/util/log'], function(JQuery, Event, Log){
    return function(elem)
    {
        var _this = this;
        var _elem = null;

        var times = {
            all: Math.floor((new Date()).getTime()/1000),
            year: 60*60*24*365,
            month: 60*60*24*31,
            week: 60*60*24*7,
            day: 60*60*24,
            hour: 60*60,
            now: 60*10
        }

        /**
         * Event for time changes. Passes the new time interval, and new time name
         * @type {Event}
         */
        this.onTimeChange = new Event();

        /**
         * Gets the name of the current time
         * @return string Name of the current time
         */
        this.getCurrentTime = function(){
            return _elem.children('li.current').data('timename');
        }

        /**
         * Selects a time on the timeslider
         * @param  string   time The name of the time to select
         */
        this.selectTime = function(time)
        {
            _elem.children('li.time-' + time).click();
        }

        var constructor = function(elem)
        {
            _elem = JQuery('<ul></ul>');
            elem.append($('<div class="bar"></div>'));
            elem.append(_elem);
            for (var time in times) {
                _elem.append($('<li class="time-' + time + '"><p>' + time + '</p></li>').data('time', times[time]).data('timename', time).click(function(){
                    // Clear all "current" times
                    _elem.children('li').each(function(){
                        JQuery(this).removeClass('current');
                    });

                    // Mark the new current time
                    JQuery(this).addClass('current');

                    // Send events
                    _this.onTimeChange.apply(JQuery(this).data('time'), JQuery(this).data('timename'));
                }));
            }

            _this.onTimeChange.register(function(new_time){
                Log('debug', 'Timescale was changed to last ' + new_time + ' seconds.');
                mixpanel.track('timescale_' + new_time);
                mixpanel.track('timescale_changed');
            });
        }
        constructor(elem);
    }
})