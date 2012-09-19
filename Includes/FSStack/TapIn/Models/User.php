<?php

namespace FSStack\TapIn\Models;

class User extends \FSStack\TapIn\Base\ApiObject
{
    public static $object_name = 'user';
    public static $primary_key = 'username';

    public $badge;
    public $created;
    public $email;
    public $level;
    public $points;
    public $username;
    public $title;
    public $nexttitle;
    public $next;
    public $last;
    public $emailhash;

    private $followers;
    private $following;

}