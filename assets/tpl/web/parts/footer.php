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

        (function(c,a){window.mixpanel=a;var b,d,h,e;b=c.createElement("script");
        b.type="text/javascript";b.async=!0;b.src=("https:"===c.location.protocol?"https:":"http:")+
        '//cdn.mxpnl.com/libs/mixpanel-2.1.min.js';d=c.getElementsByTagName("script")[0];
        d.parentNode.insertBefore(b,d);a._i=[];a.init=function(b,c,f){function d(a,b){
        var c=b.split(".");2==c.length&&(a=a[c[0]],b=c[1]);a[b]=function(){a.push([b].concat(
        Array.prototype.slice.call(arguments,0)))}}var g=a;"undefined"!==typeof f?g=a[f]=[]:
        f="mixpanel";g.people=g.people||[];h=['disable','track','track_pageview','track_links',
        'track_forms','register','register_once','unregister','identify','name_tag',
        'set_config','people.identify','people.set','people.increment'];for(e=0;e<h.length;e++)d(g,h[e]);
        a._i.push([b,c,f])};a.__SV=1.1;})(document,window.mixpanel||[]);

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

        mixpanel.init("<?=\FSStack\Config::get('mixpanel', 'token')?>");
    </script>
    <?=\AutoAB\AB::get_mixpanel_enrollment()?>

</body>
</html>


