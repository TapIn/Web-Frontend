<?php

namespace FSStack\TapIn\Controllers;

use FSStack\TapIn\Models;

class video extends \CuteControllers\Base\Rest
{
    function get_index()
    {
        $stream = new Models\Stream($this->request->get('stream_id'));
        include(TEMPLATE_DIR . '/web/video.php');
    }
}
