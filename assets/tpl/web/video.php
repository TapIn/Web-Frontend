<?php if ($stream->streamid === NULL) : ?>
    <?php throw new \CuteControllers\HttpError(404); ?>
<?php else : ?>
    <?php include('parts/header.php'); ?>
    <div class="videopage">
        <div class="row videos">
            <div class="span12">
                <?php include('parts/video.php'); ?>
                <?php if ($stream->user->username !== NULL) : ?>
                    <div class="picture">
                        <a href="/<?=$stream->user->username?>">
                            <img src="<?=$stream->user->profile_image?>" />
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <?php include('parts/footer.php'); ?>
<?php endif; ?>
