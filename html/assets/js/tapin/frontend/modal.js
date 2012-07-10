define(['jquery'], function(JQuery) {
    return function(elem)
    {

        this.page = null;
        this.content = null;
        /**
         * Shows the modal page
         * @param  string   html HTML data to draw in the modal
         * @param  object   data Optional. If specified, the html will be treated as a handlebars template, and this will be used to initialize it.
         */
        this.show = function(html, data)
        {
            console.log(this.page)
            if (typeof(data) === 'object') {
                var template = Handlebars.compile(html);
                html = template(data);

                $('#hidden-data').append($(html));
                $('#hidden-div').attr('href', '#hidden-data').fancybox().click();
            }

            // this.content.html(html);
            // this.page.removeClass('hidden');
        }

        /**
         * Hides the modal page
         */
        this.hide = function()
        {
            this.page.addClass('hidden');
            this.content.html('');
        }

        this.constructor = function(elem)
        {
            this.page = elem;
            this.content = JQuery('<div class="modal-content"></div>');
            this.page.append(this.content);
        }
        this.constructor(elem);
    }
})