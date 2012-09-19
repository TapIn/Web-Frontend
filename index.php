<?php
session_start();

header("Content-type: text/html; charset=UTF-8");

// Initialize the class loader
require_once('Includes/SplClassLoader.php');
$loader = new SplClassLoader(NULL, 'Includes');
$loader->register();

// Load the config
$config = parse_ini_file('local.ini', true);

// Set debug mode options
if (isset($config['app']['debug']) && $config['app']['debug']) {
    ini_set('display_errors', 1);
}

// Set some defines
define('WEB_DIR', dirname(__FILE__));
define('WEB_URI', $config['app']['path']);

define('APP_URI', \CuteControllers\Router::get_app_uri());

define('ASSETS_URI', $config['app']['static']);
define('THUMBS_URI', $config['app']['thumbs']);

define('INCLUDES_DIR', WEB_DIR . '/Includes');
define('INCLUDES_URI', WEB_URI . '/Includes');

define('TEMPLATE_DIR', INCLUDES_DIR . '/FSStack/TapIn/Templates');
define('TEMPLATE_URL', INCLUDES_URI . '/FSStack/TapIn/Templates');

set_include_path(INCLUDES_DIR . PATH_SEPARATOR . get_include_path());

// Start routing
try {
    \CuteControllers\Router::start('Includes/FSStack/TapIn/Controllers');
} catch (\CuteControllers\HttpError $err) {
    if ($err->getCode() == 401) {
        \CuteControllers\Router::redirect('/login.html');
    } else {
        Header("Status: " . $err->getCode() . " " . $err->getMessage());
        $error = "Error: " . $err->getMessage();
        include(TEMPLATE_DIR . '/error.php');
    }
} catch (\Exception $ex) {
    $error = "Error: $ex";
    include(TEMPLATE_DIR . '/error.php');
}
