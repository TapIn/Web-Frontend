<?php

namespace FSStack;

class Config
{
    private static $config;
    public static function get($section, $name)
    {
        if (!isset(self::$config)) {
            self::$config = parse_ini_file('local.ini', true);
        }

        if (!isset(self::$config[$section]) || !isset(self::$config[$section][$name])) {
            return NULL;
        }

        return self::$config[$section][$name];
    }
}
