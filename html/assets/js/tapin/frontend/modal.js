define(['jquery'], function(JQuery) {
    return function(elem)
    {

        this.page = null;
        this.content = null;

        this.show = function(html, data)
        {
            if (typeof(data) === 'object') {
                var template = Handlebars.compile(html);
                html = template(data);
            }

            this.content.html(html);
            this.page.removeClass('hidden');
        }

        this.hide = function()
        {
            this.page.addClass('hidden');
            this.content.html('');
        }

        this.constructor = function(elem)
        {
            this.page = elem;
            this.content = JQuery('<div class="modal-content"></div>');
        }
        this.constructor(elem);
    }
})