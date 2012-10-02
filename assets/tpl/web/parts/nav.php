<div class="container">
    <a class="brand" href="/">TapIn</a>
    <div class="nav-collapse collapse">
        <ul class="nav">
            <?php
                $pages = array(
                    //array('name' => 'About', 'uri' => '/about.html'),
                    //array('name' => 'Map', 'uri' => '/map.html'),
                );

                if (isset($_SESSION['username'])) {
                    $pages[] = array('name' => 'My Profile', 'uri' => '/' . $_SESSION['username']);
                    $pages[] = array('name' => 'Logout', 'uri' => '/login/logout.html');
                } else {
                    $pages[] = array('name' => 'Join', 'uri' => '/login.html');
                    $pages[] = array('name' => 'Login', 'uri' => '/login.html');
                }

                if (isset($this)) {
                    $current = explode('/', $this->request->uri);
                    if (isset($current[1])) {
                        $current = '/' . $current[1];
                    } else {
                        $current = '/';
                    }
                } else {
                    $current = '';
                }
            ?>
            <?php foreach ($pages as $page) : ?>
                <?php
                    list($pre) = explode('?', $page['uri'], 2);
                    $pre = explode('/', $pre);
                    $page_base = '/' . $pre[1];
                ?>
                <li<?php if($current == $page_base) echo ' class="active"'; ?>>
                    <a href="<?php echo \CuteControllers\Router::get_link($page['uri']); ?>"><?=$page['name'];?></a>
                </li>
            <?php endforeach; ?>
        </ul>

        <div class="feature">
            <a href="<?=\FSStack\Config::get('app', 'download_app')?>" onclick="mixpanel.track('download_click', {'btn':'nav'});return true;">Download App</a>
        </div>
    </div>
</div>
