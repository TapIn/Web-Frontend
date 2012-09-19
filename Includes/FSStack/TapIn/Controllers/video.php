<?php

namespace FSStack\TapIn\Controllers;

use FSStack\TapIn\Models;

class video extends \CuteControllers\Base\Rest
{
    function get_index()
    {
        $video = new Models\Video($this->request->get('id'));
        include(TEMPLATE_DIR . '/web/video.php');
    }
}
