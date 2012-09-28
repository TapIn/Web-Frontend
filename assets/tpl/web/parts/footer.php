    </div>
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

        mixpanel.init("<?=\FSStack\Config::get('mixpanel', 'token')?>");

        <?php // Register test enrollment with PHP ?>

        mixpanel.register({
        <?php $i = 0; foreach (\FSStack\AB::get_enrollment() as $test_name=>$variant) : $i++;?>
            "<?=$test_name?>": "<?=$variant?>"<?php if ($i !== count(\FSStack\AB::get_enrollment())) echo ","; ?>

        <?php endforeach; ?>
        });
    </script>
</body>
</html>
