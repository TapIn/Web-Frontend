<?php

namespace FSStack\TapIn\Base;

class ApiObject extends \FSStack\Base\Properties implements \ArrayAccess, \Countable, \Iterator
{
    private $isPopulated = FALSE;

    public function __construct($id = NULL, $sortby = NULL)
    {
        // Make sure the object has the proper properties
        if (!isset(static::$object_name) || !isset(static::$primary_key)) {
            throw new \Exception("Object and primary key name must be specified!");
        }

        // Populate the object if possible
        if (is_string($id) || is_numeric($id)) {
            $this->populate(\FSStack\TapIn\Api::get_object_by_key(static::$object_name, $id, $sortby));
        } else if(is_array($id)) {
            foreach($id as $k=>$v) {
                $this->populate(\FSStack\TapIn\Api::get_object_by_secondary_key(static::$object_name, $k, $v, $sortby));
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
        if (is_array($result)) {
            $this->_objects = array();
            foreach ($result as $sub_result) {
                $new_subobj = new static();
                $new_subobj->populate($sub_result);
                $this->_objects[] = $new_subobj;
            }
        } else {
            if (!$result) {
                throw new \CuteControllers\HttpError(404);
            }
            foreach ($result as $k=>$v) {
                $this->$k = $v;
            }
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
            if ($this->getReflector()->hasProperty($k)) {
                if (isset($_SESSION['api_user'])) {
                    parent::__set($k, $v);
                    \FSStack\TapIn\Api::from_token($_SESSION['api_user'])->user_update_object_by_key(static::$object_name, $this->{static::$primary_key}, array($k => $v));
                } else {
                    throw new \Exception("You must be logged in to do that!");
                }
            } else {
                $this->$k = $v;
            }
        }
    }


    protected $_objects = array();
    protected $position = 0;

    /**
     * Executes a function on each element of the collection.
     * @param  callable  $lambda  A function taking one paramater - the model
     * @return array              Array of responses
     */
    public function each($lambda)
    {
        $resp = array();
        foreach ($this as $model) {
            $resp[] = $lambda($model);
        }

        return $resp;
    }

    /**
     * Finds all elements with a given filter function
     * @param  callable  $lambda  A function taking one paramater - the model - which returns TRUE if it should be included
     * @return Collection         Filtered collection
     */
    public function find($lambda)
    {
        $models = $this->each(function($model) use($lambda){
            if ($lambda($model) === TRUE) {
                return $model;
            }
        });

        $models = array_merge(array(), array_filter($models));

        return new Collection($this->model, $models);
    }

    /**
     * Gets the first model matching a given filter function
     * @param  callable  $lambda  A function taking one paramater - the model - which returns TRUE if it should be included
     * @return Model              First model matching the filter, or NULL
     */
    public function find_one($lambda)
    {
        $all = $this->find($lambda);
        if (count($all) > 0) {
            return $all[0];
        } else {
            return NULL;
        }
    }

    /**
     * Filters all elements not matching a  given filter function. (A mutable version of find).
     * @param  callable  $lambda  A function taking one paramater - the model - which returns TRUE if it should be included
     * @return Collection         Current collection
     */
    public function filter($lambda)
    {
        $this->data = $this->find($lambda)->data;
        return $this;
    }

    /**
     * Removes the given object from the collection
     * @param  Model      $model_to_remove  Model to remove
     * @return Collection                   Current collection
     */
    public function remove($model_to_remove)
    {
        $this->filter(function($model) use($model_to_remove){
            return (!$model->equals($model_to_remove));
        });

        return $this;
    }

    /**
     * Returns TRUE if any model matches the given filter function, false otherwise.
     * @param  callable  $lambda  A function taking one paramater - the model - which returns TRUE if it matches
     * @return boolean            TRUE if the collection contains at least one Model matching the query, FALSE otherwise
     */
    public function contains($lambda)
    {
        return count($this->find($lambda)) > 0;
    }

    /* Interface Implementations */
    public function count()
    {
        return count($this->_objects);
    }

    public function offsetExists($offset)
    {
        return $this->count() > $offset;
    }

    public function offsetGet($offset)
    {
        return $this->_objects[$offset];
    }

    public function offsetSet($offset, $val)
    {
        throw new \Exception("Cannot set data in a collection");
    }

    public function offsetUnset($offset)
    {
        throw new \Exception("Cannot unset data in a collection");
    }

    public function current()
    {
        return $this->offsetGet($this->position);
    }

    public function key()
    {
        return $this->position;
    }

    public function next()
    {
        $this->position++;
    }

    public function rewind()
    {
        $this->position = 0;
    }

    public function valid()
    {
        return $this->offsetExists($this->position);
    }
}
