<?php include('parts/header.php'); ?>
    <div class="row">
        <div class="span12 hero">
            <?php \AutoAB\AB::test('main_page_hero',
                                        'cloud', ASSETS_DIR . '/tpl/web/parts/heros/cloud.php',
                                        'broadcast', ASSETS_DIR . '/tpl/web/parts/heros/broadcast.php'
                                    ); ?>
            <a class="download-button" href="<?=\FSStack\Config::get('app', 'download_app')?>" onclick="mixpanel.track('download_click', {'btn':'hero'});return true;">Download the App</a>

        </div>
    </div>
    <div id="underscroll">
        <img src="<?=ASSETS_URI?>/img/underscroll.png" /><br />
        <a class="download-button" href="<?=\FSStack\Config::get('app', 'download_app')?>" onclick="mixpanel.track('download_click', {'btn':'underscroll'});return true;">Download the App</a><br /><br />
        <img src="<?=ASSETS_URI?>/img/user-vids.png" /><br />
        <?php $featured_streams = new \FSStack\TapIn\Models\Stream(array('viewcount' => ''), 'Viewcount'); ?>
        <div class="videos">
            <?php $i = 0; foreach ($featured_streams as $stream) : $i++; if ($i > 16) break; ?>
                <a
                    onclick="mixpanel.track('video_click', {'from':'underscroll_featured'});return true;"
                    href="<?=\CuteControllers\Router::get_link('/v/' . $stream->streamid);?>"
                    class="video">

                    <img src="<?=THUMBS_URI . '/' . $stream->streamid . '/480x360/latest.jpg'?>" />
                </a>
            <?php endforeach; ?>
            <hr />
        </div>
    </div>
<?php include('parts/footer.php'); ?>
