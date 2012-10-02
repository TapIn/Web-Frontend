<?php

namespace FSStack\TapIn\Controllers;

use \FSStack\TapIn\Models;

class login extends \CuteControllers\Base\Rest
{
    function get_index()
    {
        if (isset($_SESSION['username'])) {
            $this->redirect('/' . $_SESSION['username']);
        } else {
            include(TEMPLATE_DIR . '/web/login.php');
        }
    }

    function get_logout()
    {
        unset($_SESSION['api_user']);
        unset($_SESSION['username']);
        $this->redirect('/login.html');
    }

    function post_login()
    {
        $username = $this->request->post('username');
        $password = $this->request->post('password');

        try {
            \FSStack\TapIn\Api::login($username, $password);
            $_SESSION['username'] = $username;
            $this->redirect('/' . $username);
        } catch (\Exception $ex) {
            $error = $ex->getMessage();
            include(TEMPLATE_DIR . '/web/login.php');
        }
    }

    function post_register()
    {
        $username = $this->request->post('username');
        $password = $this->request->post('password');
        $confirm_password = $this->request->post('password_confim');
        $email = $this->request->post('email');

        if (!$username || !$password || !$confirm_password || !$email) {
            $error = 'All fields are required.';
            include(TEMPLATE_DIR . '/web/login.php');
        } else if ($password !== $confirm_password) {
            $error = 'Passwords did not match.';
            include(TEMPLATE_DIR . '/web/login.php');
        } else {
            try {
                \FSStack\TapIn\Api::register($username, $password, $email);
                $_SESSION['username'] = $username;
                $this->redirect('/' . $username);
            } catch (\Exception $ex) {
                $error = $ex->getMessage();
                include(TEMPLATE_DIR . '/web/login.php');
            }
        }


    }
}
