<?php

namespace FSStack\Base;

abstract class Properties
{
    /**
     * Cache of reflectors for all objects
     * @var array
     */
    protected static $reflectors = array();
    /**
     * Gets a reflector for the current object
     * @return \ReflectionClass Reflector for the current object
     */
    protected function getReflector()
    {
        // Ironic that we have a "getX" property in a system intended to replace it...
        if (!isset(static::$reflectors[get_class($this)]))
        {
            static::$reflectors[get_class($this)] = new \ReflectionClass($this);
        }

        return static::$reflectors[get_class($this)];
    }


    /**
     * Magic getter method, which implements better getters in PHP. Allows getters
     * of the style __get_x() to exist.
     *
     * @param  string $key Name of the property to get
     * @return mixed       Result
     */
    public function __get($key)
    {
        $getter_name = '__get_' . $key;
        // If there's a defined getter, call it
        if ($this->getReflector()->hasMethod($getter_name)) {
            return $this->$getter_name();
        }

        // If we're trying to access a property, allow it
        else if ($this->getReflector()->hasProperty($key)) {
            return $this->$key;
        }

        // Otherwise, don't let the user set the param
        else {
            throw new \Exception("Read access to paramater $key is not allowed.");
        }
    }

    /**
     * Magic setter method, which implements better setters in PHP. Allows setters
     * of the form set_x($val) to exist.
     *
     * @param string $key Property to assign to
     * @param mixed  $val Value to assign
     */
    public function __set($key, $val)
    {
        if (!$this->__validate($key, $val)) {
            throw new \Exception('Paramater did not pass validation.');
        }

        $setter_name = '__set_' . $key;

        // If there's a defined setter, call it
        if ($this->getReflector()->hasMethod($setter_name)) {
            $this->$setter_name($val);
        }

        // If we're trying to set a field in the table, allow it
        else if ($this->getReflector()->hasProperty($key)) {
            $this->$key = $val;
        }

        // Otherwise, don't let the user set the param
        else {
            throw new \Exception("Write access to paramater $key is not allowed.");
        }
    }

    /**
     * Attempts to validate the given key:
     * 1) Using the __validate_:key method, which returns TRUE or FALSE
     * 2) Using a built-in validation if there is a __validate_:key property
     *
     * @param  string $key Key to validate on
     * @param  mixed  $val Value to check
     * @return bool        TRUE if the value passes all checks, otherwise FALSE
     */
    protected function __validate($key, $val)
    {
        $validator_name = '__validate_' . $key;
        // If there's a defined validation method, call it
        if ($this->getReflector()->hasMethod($validator_name)) {
            return $this->$validator_name($val);
        }

        // If there's a defined validation string, validate for that type
        else if ($this->getReflector()->hasProperty($validator_name)) {
            switch($this->$validator_name)
            {
                case 'string':
                case 'str':
                    return is_string($val);
                case 'integer':
                case 'int':
                    return is_int($val);
                case 'boolean':
                case 'bool':
                    return is_bool($val);
                case 'email':
                    return preg_match("\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*", $val);
                case 'phone':
                    return preg_match("1?\s*\W?\s*([2-9][0-8][0-9])\s*\W?\s*([2-9][0-9]{2})\s*\W?\s*([0-9]{4})(\se?x?t?(\d*))?", $val);
                case 'ssn':
                    return preg_match("^(\d{3}-?\d{2}-?\d{4}|XXX-XX-XXXX)$", $val);
                case 'date':
                case 'time';
                case 'datetime':
                    return mktime($val) > 0;
                default:
                    return FALSE;
            }
        }

        // No validation, so it's okay
        return TRUE;
    }
}
