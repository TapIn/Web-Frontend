<?php include('parts/header.php'); ?>
    <div class="row">
        <div class="span12">
            <p>Something has gone horribly wrong.</p>
            <?php if (\FSStack\Config::get('app', 'debug')) : ?>
                <p><pre>
<?=$error?>
                </pre></p>
            <?php endif; ?>
        </div>
    </div>
<?php include('parts/footer.php'); ?>
