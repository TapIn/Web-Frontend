<?php

namespace FSStack\TapIn\Models;

class User extends \FSStack\TapIn\Base\ApiObject
{
    public static $object_name = 'user';
    public static $primary_key = 'username';

    protected $username;
    protected $first_name;
    protected $last_name;
    protected $description;
    protected $email;
    protected $emailhash;

    protected $created;

    protected $badge;
    protected $title;
    protected $level;
    protected $points;
    protected $nexttitle;
    protected $next;
    protected $last;

    protected $live;

    public function __get_profile_image()
    {
        $hash = md5(strtolower(trim($this->email)));
        return "http://www.gravatar.com/avatar/$hash?s=200&d=retro";
    }

    public function __get_videos()
    {
        return new Stream(array('user' => $this->username), 'streamend');
    }

    public function __get_userID()
    {
        return $this->username;
    }

    public function __get_is_live()
    {
        return $this->live !== NULL && $this->live !== '';
    }

    public function __get_live()
    {
        return new Stream($this->live);
    }

    public function __get_name()
    {
        return $this->username;
    }

    public static function current_user()
    {
        if (isset($_SESSION) && isset($_SESSION['username'])) {
            return new User($_SESSION['username']);
        }
    }

    private $followers;
    private $following;

}
