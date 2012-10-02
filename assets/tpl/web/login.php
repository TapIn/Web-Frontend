<?php include('parts/header.php'); ?>
<script type="text/javascript">
    mixpanel.track('loginregister_view');
</script>
<div class="videopage">
    <div class="row">
        <div class="span12">
            <?php if (isset($error)) : ?>
                <div class="alert alert-error">
                    <?=$error?>
                </div>
            <?php endif; ?>
            <div id="loginregisterform">
                <form id="register" method="post" action="/login/register" onsubmit="mixpanel.track('register');return true;">
                    Sign up to create your own profile page.<br />
                    <input type="text" name="username" placeholder="Username" /><br />
                    <input type="text" name="email" placeholder="Email" /><br />
                    <input type="password" name="password" placeholder="Password" /><br />
                    <input type="password" name="password_confirm" placeholder="Password" /><br />
                    <input type="submit" value="Create an Account" />
                </form>

                <form id="login" method="post" action="/login/login" onsubmit="mixpanel.track('login');return true;">
                    <strong>Already have an account?</strong><br />
                    <input type="text" name="username" placeholder="Username" /><br />
                    <input type="password" name="password" placeholder="Password" /><br />
                    <input type="submit" value="Log In" />
                </form>

                <hr />
            </div>
        </div>
    </div>
</div>
<?php include('parts/footer.php'); ?>



