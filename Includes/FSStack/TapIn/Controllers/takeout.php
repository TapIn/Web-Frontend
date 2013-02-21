<?php

namespace FSStack\TapIn\Controllers;

use \FSStack\TapIn\Models;

class takeout extends \CuteControllers\Base\Rest {

    function get_index() {
        include(TEMPLATE_DIR . '/web/takeout.php');
    }
}
?>
