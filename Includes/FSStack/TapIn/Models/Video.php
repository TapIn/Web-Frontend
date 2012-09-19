<?php

namespace FSStack\TapIn\Models;

use FSStack\TapIn\Models;

class Video extends \FSStack\TapIn\Base\ApiObject
{
    public static $object_name = 'stream';
    public static $primary_key = 'streamid';

    public $featured;
    public $host;
    public $phoneid;
    public $points;
    public $streamconnectioncount;
    public $streamend;
    public $streamid;
    public $uid;
    public $user;
    public $viewcount;

    public function __get_id()
    {
        return $this->streamid;
    }

    public function __get_user()
    {
        return new Models\User($this->user);
    }
}
