<?php

namespace FSStack\TapIn\Base;

class ApiObject extends \FSStack\Base\Properties
{
    private $isPopulated = FALSE;

    public function __construct($id = NULL)
    {
        // Make sure the object has the proper properties
        if (!isset(static::$object_name) || !isset(static::$primary_key)) {
            throw new \Exception("Object and primary key name must be specified!");
        }

        // Populate the object if possible
        if (is_string($id) || is_numeric($id)) {
            $this->populate(\FSStack\TapIn\Api::get_object_by_key(static::$object_name, $id));
        } else if(is_array($id)) {
            foreach($id as $k=>$v) {
                $this->populate(\FSStack\TapIn\Api::get_object_by_secondary_key(static::$object_name, $k, $v));
                break; // Only use the first element
            }
        }

        $this->isPopulated = true;
    }

    /**
     * Assigns values to the object from an associative array
     * @param  array  $result The array to fill the object with
     */
    protected function populate($result)
    {
        foreach ($result as $k=>$v) {
            $this->$k = $v;
        }
    }

    /**
     * PHP magic method for setters. Updates the object in the database.
     * @param string $k Name to set
     * @param mixed  $v Value to set
     */
    public function __set($k, $v)
    {
        if (!$this->isPopulated) {
            $this->$k = $v;
        } else {
            if (isset(\FSStack\TapIn\Api::$User)) {
                parent::__set($k, $v);
                \FSStack\TapIn\Api::$User->update_object_by_key(static::$object_name, $this->{static::$primary_key}, array($k => $v));
            } else {
                throw new \Exception("You must be logged in to do that!");
            }
        }
    }
}
