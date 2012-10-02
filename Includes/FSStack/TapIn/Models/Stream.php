<?php

namespace FSStack\TapIn\Models;

use FSStack\TapIn\Models;

class Stream extends \FSStack\TapIn\Base\ApiObject
{
    public static $object_name = 'stream';
    public static $primary_key = 'streamid';

    public $featured;
    public $host;
    public $phoneid;
    public $points;
    public $streamconnectioncount;
    public $streamstart;
    public $deleted;
    public $streamend;
    public $streamid;
    public $uid;
    protected $user;
    public $viewcount;

    public function __get_id()
    {
        return $this->streamid;
    }

    public function __get_user()
    {
        return new Models\User($this->user);
    }

    public function __get_is_live()
    {
        return !(isset($this->streamend) && $this->streamend != '');
    }

    /**
     * Assigns values to the object from an associative array
     * @param  array  $result The array to fill the object with
     */
    protected function populate($result)
    {
        if (is_array($result)) {
            $this->_objects = array();
            foreach ($result as $sub_result) {
                $new_subobj = new static();
                $new_subobj->populate($sub_result[1]);
                $this->_objects[] = $new_subobj;
            }
        } else if ($result !== NULL) {
            foreach ($result as $k=>$v) {
                $this->$k = $v;
            }
        }
    }
}
