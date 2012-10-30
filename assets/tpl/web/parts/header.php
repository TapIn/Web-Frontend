<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:og="http://ogp.me/ns#"
      xmlns:fb="https://www.facebook.com/2008/fbml">
<head>
    <?php if (isset($title)) : ?>
        <title></title>
        <meta property="og:title" content="<?=$title?> :: TapIn.tv"/>
    <?php else : ?>
        <title>TapIn.tv</title>
        <meta property="og:title" content="TapIn.tv"/>
    <?php endif; ?>

    <?php if (isset($video)) : ?>
        <link rel="image_src" href="<?=THUMBS_URI?>/<?=$video->id?>/144x108/latest.jpg" />
        <meta property="og:image" content="<?=THUMBS_URI?>/<?=$video->id?>/144x108/latest.jpg"/>
    <?php else : ?>
        <link rel="image_src" href="<?=ASSETS_URI?>/img/preview.jpg" />
        <meta property="og:image" content="<?=ASSETS_URI?>/img/preview.jpg"/>
    <?php endif; ?>

    <meta property="og:type" content="video.other"/>
    <meta property="og:description" content="TapIn.tv is the fastest way to share video online."/>

    <link rel="stylesheet" href="<?=ASSETS_URI?>/css/bootstrap.css"/>
    <link rel="stylesheet" href="<?=ASSETS_URI?>/css/tapin.css"/>
</head>
<body>
    <script type="text/javascript">var _sf_startpt=(new Date()).getTime()</script>
    <script type="text/javascript">
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
    </script>
    <div class="container">
        <div class="navbar navbar-fixed-top">
            <div class="navbar-inner">
                <?php include('nav.php'); ?>
            </div>
        </div>
