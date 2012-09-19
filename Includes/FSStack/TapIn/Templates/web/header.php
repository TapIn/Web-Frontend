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
</head>
<body>
    <div class="container">
        <!-- Headerrrrrr -->
        <div class="navbar navbar-inverse navbar-fixed-top">
            <div class="navbar-inner">
                <div class="container">
                    <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    </button>
                    <a class="brand" href="/index.html">TapIn.tv</a>
                    <div class="nav-collapse collapse">
                        <ul class="nav">
                            <li>
                                <a href="./index.html">Home</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
