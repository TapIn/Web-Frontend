<?php include('parts/header.php'); ?>
<div class="userprofile">
    <?php
    /**
     * Include the live video player at the top of the profile if the user is live right now.
     */
    ?>
    <?php if ($user->is_live) : ?>
        <div class="row live">
            <div class="span12">
                <?php
                    $stream = $user->live;
                    include('parts/video.php') ?>
            </div>
        </div>
    <?php endif; ?>

    <div class="row details">
        <div class="span12">
            <img src="<?=htmlentities($user->profile_image)?>" alt="<?htmlentities($user->name)?>" class="picture" />
            <span class="name">
                <?=htmlentities($user->name)?>
            </span>
            <span class="description">
                <?php if (isset($_SESSION['username']) && $user->username === $_SESSION['username']) : ?>
                    <form method="post">
                        <input class="input input-xxlarge" type="text" placeholder="Bio" name="description" value="<?=htmlentities($user->description)?>" /><br />
                        <input class="btn" type="submit" value="Save profile" />
                    </form>
                <?php else : ?>
                    <?=htmlentities($user->description)?>
                <?php endif; ?>
            </span>
        </div>
    </div>

    <div class="row videos">
        <div class="span12">
            <?php foreach ($user->videos as $video) : ?>
                <?php if ($user->is_live && $video->streamid === $user->live->streamid) continue; // Don't list the live video again ?>
                <a
                    href="<?=\CuteControllers\Router::get_link('/v/' . $video->streamid);?>"
                    class="video">

                    <img src="<?=THUMBS_URI . '/' . $video->streamid . '/480x360/latest.jpg'?>" />
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</div>
<?php include('parts/footer.php'); ?>
