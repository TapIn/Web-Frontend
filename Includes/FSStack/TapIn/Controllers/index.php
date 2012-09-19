<?php

namespace FSStack\TapIn\Controllers;

class index extends \CuteControllers\Base\Rest
{
    function get_index()
    {
        include(TEMPLATE_DIR . '/web/index.php');
    }
}
