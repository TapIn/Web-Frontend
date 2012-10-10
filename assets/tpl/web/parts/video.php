<div id="video-share" data-video="<?=$stream->streamid?>">
    <a class="share fb" href="#"><img src="<?=ASSETS_URI?>/img/share-fb.png" alt="Share on Facebook!" /></a>
    <a class="share twitter" href="#"><img src="<?=ASSETS_URI?>/img/share-twitter.png" alt="Share on Facebook!" /></a>
</div>
<?php if ($stream->is_live) : ?>
    <div class="player" data-engine="flash" data-rtmp="rtmp://<?=$stream->host?>/live/<?=$stream->streamid?>">
        <video src="http://example.com/stream"></video> <!--This is a really stupid flowplayer hack-->
    </div>
    <div class="videoinfo">
        <strong class="live">Live Now</strong>
    </div>
    <script type="text/javascript">
        mixpanel.track('play', {'live':'true', 'streamid':'<?=$stream->streamid?>'});
    </script>
<?php else : ?>
    <div class="player" data-rtmp="rtmp://recorded.stream.tapin.tv/cfx/st/">
        <video src="http://cdn.content.tapin.tv/<?=$stream->streamid?>/stream.mp4"></video>
    </div>
    <script type="text/javascript">
        mixpanel.track('play', {'live':'false', 'streamid':'<?=$stream->streamid?>'});
    </script>
<?php endif; ?>
