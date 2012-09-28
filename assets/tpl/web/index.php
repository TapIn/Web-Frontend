<?php include('parts/header.php'); ?>
    <div class="row">
        <div class="span12 hero">
            <?php \FSStack\AB::run_test('main_page_hero',
                                        array('name' => 'cloud', 'value' => ASSETS_DIR . '/tpl/web/parts/heros/cloud.php'),
                                        array('name' => 'social', 'value' => ASSETS_DIR . '/tpl/web/parts/heros/social.php')
                                    ); ?>
            <a class="download-button" href="<?=\FSStack\Config::get('app', 'download_app')?>">Download the App</a>
        </div>
    </div>
<?php include('parts/footer.php'); ?>
