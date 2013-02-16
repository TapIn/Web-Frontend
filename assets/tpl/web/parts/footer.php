    </div>

    <?php // Flowplayer skin: ?>
    <link rel="stylesheet" type="text/css" href="<?=ASSETS_URI?>/flowplayer/skin/minimalist.css" />

    <script src="http://code.jquery.com/jquery-1.8.3.min.js"></script>

    <script type="text/javascript">
    mixpanel.track('page viewed', {'page name' : document.title, 'url' : window.location.pathname});
    </script>

    <script type="text/javascript">
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-30870918-1']);
    _gaq.push(['_setDomainName', 'tapin.tv']);
    _gaq.push(['_trackPageview']);

    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
    </script>

    <script src="<?=ASSETS_URI?>/flowplayer/flowplayer.js"></script>
    <script type="text/javascript">
    flowplayer.conf = {
        swf: '<?=ASSETS_URI?>/flowplayer/flowplayer.swf',
        key: '$244665380945079',
        logo: null,
        embed: false,
        debug: false,
        errors: [ 'Video loading aborted', 'Network error', 'Video not properly encoded', 'Video could not be found', 'Media not supported' ],
        autoplay: true,
        engine: 'flash',
        disabled: false,
        keyboard: true,
        ratio: 0.5625,
        splash: false,
        volume: 0.8
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

    <script data-cfasync="false" type='text/javascript'>/*{literal}<![CDATA[*/
    window.olark||(function(c){var f=window,d=document,l=f.location.protocol=="https:"?"https:":"http:",z=c.name,r="load";var nt=function(){f[z]=function(){(a.s=a.s||[]).push(arguments)};var a=f[z]._={},q=c.methods.length;while(q--){(function(n){f[z][n]=function(){f[z]("call",n,arguments)}})(c.methods[q])}a.l=c.loader;a.i=nt;a.p={0:+new Date};a.P=function(u){a.p[u]=new Date-a.p[0]};function s(){a.P(r);f[z](r)}f.addEventListener?f.addEventListener(r,s,false):f.attachEvent("on"+r,s);var ld=function(){function p(hd){hd="head";return["<",hd,"></",hd,"><",i,' onl' + 'oad="var d=',g,";d.getElementsByTagName('head')[0].",j,"(d.",h,"('script')).",k,"='",l,"//",a.l,"'",'"',"></",i,">"].join("")}var i="body",m=d[i];if(!m){return setTimeout(ld,100)}a.P(1);var j="appendChild",h="createElement",k="src",n=d[h]("div"),v=n[j](d[h](z)),b=d[h]("iframe"),g="document",e="domain",o;n.style.display="none";m.insertBefore(n,m.firstChild).id=z;b.frameBorder="0";b.id=z+"-loader";if(/MSIE[ ]+6/.test(navigator.userAgent)){b.src="javascript:false"}b.allowTransparency="true";v[j](b);try{b.contentWindow[g].open()}catch(w){c[e]=d[e];o="javascript:var d="+g+".open();d.domain='"+d.domain+"';";b[k]=o+"void(0);"}try{var t=b.contentWindow[g];t.write(p());t.close()}catch(x){b[k]=o+'d.write("'+p().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};ld()};nt()})({loader: "static.olark.com/jsclient/loader0.js",name:"olark",methods:["configure","extend","declare","identify"]});
    /* custom configuration goes here (www.olark.com/documentation) */
    olark.identify('1862-781-10-3510');/*]]>{/literal}*/</script>

    <script type="text/javascript">
    var _sf_async_config = { uid: 42510, domain: 'tapin.tv' };
    (function() {
        function loadChartbeat() {
          window._sf_endpt = (new Date()).getTime();
          var e = document.createElement('script');
          e.setAttribute('language', 'javascript');
          e.setAttribute('type', 'text/javascript');
          e.setAttribute('src',
            (("https:" == document.location.protocol) ? "https://a248.e.akamai.net/chartbeat.download.akamai.com/102508/" : "http://static.chartbeat.com/") +
            "js/chartbeat.js");
          document.body.appendChild(e);
      };
      var oldonload = window.onload;
      window.onload = (typeof window.onload != 'function') ?
      loadChartbeat : function() { oldonload(); loadChartbeat(); };
    })();
    </script>

</body>
</html>


