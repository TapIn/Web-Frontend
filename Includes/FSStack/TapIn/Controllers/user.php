<?php

namespace FSStack\TapIn\Controllers;

use \FSStack\TapIn\Models;

class user extends \CuteControllers\Base\Rest
{
    function get_index()
    {
        $user = new Models\User($this->request->request('username'));
        include(TEMPLATE_DIR . '/web/user.php');
    }

    function post_index()
    {
        $user = new Models\User($this->request->request('username'));
        $user->description = $this->request->post('description');
        $this->redirect('/' . $user->username);
    }
}
