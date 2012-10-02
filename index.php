<?php
session_start();

header("Content-type: text/html; charset=UTF-8");

// Initialize the class loader
require_once('Includes/SplClassLoader.php');
$loader = new SplClassLoader(NULL, 'Includes');
$loader->register();

// Set debug mode options
if (\FSStack\Config::get('app', 'debug')) {
    ini_set('display_errors', 1);
    \FSStack\TapIn\Api::$debug = TRUE;
}

// Set some defines
define('WEB_DIR', dirname(__FILE__));
define('WEB_URI', \FSStack\Config::get('app', 'path'));

define('APP_URI', \CuteControllers\Router::get_app_uri());

define('ASSETS_DIR', WEB_DIR . '/assets');
define('ASSETS_URI', \FSStack\Config::get('app', 'static'));

define('THUMBS_URI', \FSStack\Config::get('app', 'thumbs'));

define('INCLUDES_DIR', WEB_DIR . '/Includes');
define('INCLUDES_URI', WEB_URI . '/Includes');

define('CONTROLLERS_DIR', INCLUDES_DIR . '/FSStack/TapIn/Controllers');

define('TEMPLATE_DIR', ASSETS_DIR . '/tpl');
define('TEMPLATE_URL', ASSETS_URI . '/tpl');

set_include_path(INCLUDES_DIR . PATH_SEPARATOR . get_include_path());

include('rewrites.php');

// Start routing
try {
    \CuteControllers\Router::start(CONTROLLERS_DIR);
} catch (\CuteControllers\HttpError $err) {
    if ($err->getCode() == 401) {
        \CuteControllers\Router::redirect('/login.html');
    } else {
        Header("Status: " . $err->getCode() . " " . $err->getMessage());
        $error = "Error: " . $err->getMessage();
        include(TEMPLATE_DIR . '/web/error.php');
    }
} catch (\Exception $ex) {
    $error = "Error: $ex";
    include(TEMPLATE_DIR . '/web/error.php');
}
