 <?php if ($stream->is_live) : ?>
    <div class="player" data-engine="flash" data-rtmp="rtmp://<?=$stream->host?>/live/<?=$stream->streamid?>">
        <video src="http://example.com/stream"></video> <!--This is a really stupid flowplayer hack-->
    </div>
    <div class="videoinfo live">
        <i>&bull;</i> Live Now
    </div>
<?php else : ?>
    <div class="player" data-rtmp="rtmp://recorded.stream.tapin.tv/cfx/st/">
        <video src="http://cdn.content.tapin.tv/<?=$stream->streamid?>/stream.mp4"></video>
    </div>
<?php endif; ?>
