<?php

namespace FSStack;

/*
 * AB testing framework!
 */
class AB
{
    private static $tests = array();

    /**
     * Runs an AB test
     * @param  string $test_id ID of the test to run
     * @params mixed           Params to use for the test
     * @return mixed           Selected test -- result of the called function if the selected test was a function taking 0 arguments, result of an
     *                         included file if the selected test was the path of a file which exists, otherwise the selected object
     */
    public static function run_test($test_id)
    {
        $options = func_get_args();
        array_shift($options); // Remove $test_id from the args


        if (\CuteControllers\Request::current()->request('__ab_' . $test_id)) {
            // Set the test to what the user specified
            $selected_id = \CuteControllers\Request::current()->request('__ab_' . $test_id);

            foreach ($options as $option) {
                if (is_array($option) && isset($option['name']) && isset($option['value']) && count($option) == 2
                    && $option['name'] == $selected_id) {
                    $selected = $option['value'];
                    break;
                }
            }

            if (!isset($selected)) {
                $selected = $options[$selected_id];
            }
        } else {
            // Pick the test at random

            // Now generate the random seed. We want the current user to always see the same option for any given test, so the seed will be based on the
            // IP and test ID.
            $seed = \CuteControllers\Request::current()->ip . $test_id;
            $selected_id = self::seeded_random_number($seed, 0, count($options) - 1);
            $selected = $options[$selected_id];

            // If the element is an array in the format ['name':{string}, 'value':{mixed}], set the name and value
            if (is_array($selected) && isset($selected['name']) && isset($selected['value']) && count($selected) == 2) {
                $selected_id = $selected['name'];
                $selected = $selected['value'];
            }
        }


        self::$tests[$test_id] = $selected_id;

        // If the user asks for a list of AB test spots, show a box here!
        if (\CuteControllers\Request::current()->request('__ab_show_all')) {
            echo '<span class="ab zone">' . $test_id . ':</span>';
            $i = 0;
            foreach ($options as $option) {
                if (is_array($option) && isset($option['name']) && isset($option['value']) && count($option) == 2) {
                    echo '<a href="?__ab_' . $test_id . '=' . $option['name'] . '"  class="ab option">' . $option['name'] . '</a>';
                } else {
                    echo '<a href="?__ab_' . $test_id . '=' . $i . '" class="ab option">' . $i . '</a>';
                }
                $i++;
            }
        }

        // Magic happens here!
        if (is_callable($selected)) {
            // If it's a function, check if it takes no arguments. If so, call it.
            $reflector = new ReflectionFunction($selected);
            if ($selected->getNumberOfParameters() === 0) {
                return $selected();
            } else {
                return $selected;
            }
        } else if (is_string($selected) && file_exists($selected)) {
            return include($selected); // If it's a file which exists, include it.
        }

        // Default to returning the selected object
        return $selected;
    }

    /**
     * Gets a list of tests the user is enrolled in
     * @return array key=>value pair of tests
     */
    public static function get_enrollment()
    {
        return self::$tests;
    }

    /**
     * Gets a random number from the seed
     * @param  string $seed The seed to use
     * @param  int    $min  Min number
     * @param  int    $max  Max number
     * @return int          Random number
     */
    private static function seeded_random_number($seed, $min, $max)
    {
        $hash_seed = md5($seed);
        $hash_seed = substr($hash_seed, 0, 6); // srand takes a signed int, so we need to make sure the value of hexdec is an ingeger. On 32-bit platforms,
                                          // that means we have 31 bits, so we'll just get the first 6 characters of the hash. This isn't great, but
                                          // it's just an AB test so whatever.

        $int_seed = intval(hexdec($hash_seed));

        mt_srand($int_seed); // Now we seed the random number generator...
        return mt_rand($min, $max); // ...and generate the number!
    }
}
