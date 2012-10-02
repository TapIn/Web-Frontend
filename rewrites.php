<?php

\CuteControllers\Router::rewrite('/v/(.*)/*', '/video?stream_id=$1');

// If the path doesn't exist, assume it's a user
// THIS ONE IS FOR YOU VU
if (!\CuteControllers\Router::check_route(CONTROLLERS_DIR)) {
    \CuteControllers\Router::rewrite('/(.*)/', '/user?username=$1');
}
