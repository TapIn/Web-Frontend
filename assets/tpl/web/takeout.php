<?php if (!isset($_SESSION['username'])) { header("Location: /login.html"); exit; } ?>
<?php include('parts/header.php'); ?>
    <div class="row">
        <div class="span12">
            <h2>TapIn Takeout</h2>
            <p>Hey <?=$_SESSION['username']?>,</p>
            <p>As you may have heard, TapIn is soon going away. We had a great run, but we never got the traction we
                needed to keep the service running. Having to shut down TapIn is quite unfortunate, but we're going to
                do everything it takes to help you get your videos out before we go.</p>
            <p>You can use this form to export your videos. This can take some time, depending on how many videos you've
                taken. <strong>Enter your email below, and we'll send you a link to download your files when they're
                ready.</strong></p>
            <form method="get" action="/export">
                <input type="hidden" id="username" name="username" value="<?=$_SESSION['username']?>" />
                <input type="text" id="email" name="email" placeholder="Email Address" />
                <input type="submit" value="Start" />
            </form>
        </div>
    </div>
<?php include('parts/footer.php'); ?>
    <script type="text/javascript">
        $('form').on('submit', function(event){
            event.stopPropagation();
            var xhr = $.get('http://export.tapin.tv/export?username=<?=urlencode($_SESSION["username"])?>&email=' + encodeURI($('#email').val()), function(){});
            setTimeout(function(){xhr.abort()}, 5000);
            $(this).parent().text("Thanks, your order is on its way! It can take some time to cook; you should get your email within 15 minutes.");
            return false;
        })
    </script>
