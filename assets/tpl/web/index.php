<?php include('parts/header.php'); ?>
    <div class="row">
        <div class="span12 hero">
            <?php \AutoAB\AB::test('main_page_hero',
                                        'cloud', ASSETS_DIR . '/tpl/web/parts/heros/cloud.php',
                                        'broadcast', ASSETS_DIR . '/tpl/web/parts/heros/broadcast.php'
                                    ); ?>
            <a class="download-button" href="<?=\FSStack\Config::get('app', 'download_app')?>">Download the App</a>

        </div>
    </div>
<?php include('parts/footer.php'); ?>