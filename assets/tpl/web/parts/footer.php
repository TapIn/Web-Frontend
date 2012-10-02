    </div>

    <?php // Flowplayer skin: ?>
    <link rel="stylesheet" type="text/css" href="<?=ASSETS_URI?>/flowplayer/skin/minimalist.css" />

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

    <script src="<?=ASSETS_URI?>/flowplayer/flowplayer.js"></script>
    <script type="text/javascript">
        flowplayer.conf = {
            swf: '<?=ASSETS_URI?>/flowplayer/flowplayer.swf',
            key: '$244665380945079',
            logo: null,
            embed: false,
            debug: true,
            errors: [ 'Video loading aborted', 'Network error', 'Video not properly encoded', 'Video could not be found', 'Media not supported' ],
            autoplay: true,
            engine: 'flash'
        }

        // Don't use feature detection because Android devices "support" flash but it's not optimal.
        var agent = navigator.userAgent.toLowerCase();
        if ((agent.indexOf('iphone') != -1) || (agent.indexOf('ipod') != -1) || (agent.indexOf('ipad') != -1) ||
            (agent.indexOf('android') != -1)) {
            flowplayer.conf.engine = 'html5';
        }


        $(".player").flowplayer();
    </script>

    <script type="text/javascript" src="//use.typekit.net/edm6est.js"></script>
    <script type="text/javascript">
        try{Typekit.load();}catch(e){}

        $('.share.fb').live('click', function(event){
            event.stopPropagation();

            mixpanel.track('share', {'site': 'fb'});

            var current_stream_id = $(this).parent().attr('data-video');

            var url = 'http://www.facebook.com/sharer.php?u=http%3A%2F%2Fs.tapin.tv%2Ft%2f' + current_stream_id;
            newwindow=window.open(url,'','height=400,width=658');
            if (window.focus) {newwindow.focus()}
            return false;
        });

        $('.share.twitter').live('click', function(event){
            event.stopPropagation();

            mixpanel.track('share', {'site': 'twitter'});

            var current_stream_id = $(this).parent().attr('data-video');

            var url = 'https://twitter.com/share?text=Check%20out%20this%20stream!&url=http%3A%2F%2Fs.tapin.tv%2Ft%2f' + current_stream_id;
            newwindow=window.open(url,'','height=260,width=700');
            if (window.focus) {newwindow.focus()}
            return false;
        })

    </script>
    <?=\AutoAB\AB::get_mixpanel_enrollment()?>

</body>
</html>


