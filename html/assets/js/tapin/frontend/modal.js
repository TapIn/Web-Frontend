define(['jquery'], function(JQuery) {
    return new (function()
    {

        this.show = function(html, data)
        {
            if (typeof(data) === 'object') {
                var template = Handlebars.compile(html);
                html = template(data);
            }

            JQuery('#modal-page #modal-content').html(html);
            JQuery('#modal-page').removeClass('hidden');
        }

        this.hide = function()
        {
            JQuery('#modal-page').addClass('hidden');
            JQuery('#modal-page #modal-content').html('');
        }

        this.constructor = function()
        {

        }
        this.constructor();
    })();
})