<div class="container">
    <a class="brand" href="/">TapIn</a>
    <div class="nav-collapse collapse">
        <ul class="nav">
            <?php
                $pages = array(
                    array('name' => 'Join', 'uri' => '/join.html'),
                    array('name' => 'Login', 'uri' => '/login.html'),
                    array('name' => 'About', 'uri' => '/about.html'),
                    array('name' => 'Map', 'uri' => '/map.html'),
                );

                if (isset($this)) {
                    $current = explode('/', $this->request->uri);
                    $current = '/' . $current[1];
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
            <a href="<?=\FSStack\Config::get('app', 'download_app')?>">Download App</a>
        </div>
    </div>
</div>
