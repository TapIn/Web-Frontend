<?php

namespace FSStack\TapIn;

class Api
{
    const base = 'http://api.tapin.tv/web/';
    const base_debug = 'http://debug.api.tapin.tv/web/';


    /**
     * API token
     * @var string
     */
    public $token;

    /**
     * Switches to the debug API endpoint for testing
     * @var boolean
     */
    public static $debug = FALSE;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public static function from_token($token)
    {
        return new static($token);
    }

    /**
     * Logs the user in and returns an Api object
     * @param  string $username The user's username
     * @param  string $password The user's password (plain-text)
     * @return Api              Logged-in API
     */
    public static function login($username, $password)
    {
        $result = self::fetch_api_resource('login', array(
                                                            'username' => $username,
                                                            'password' => $password), 'GET', FALSE);
        if (isset($result->error)) {
            throw new \Exception($result->error);
        } else {
            $_SESSION['api_user'] = $result->token;
            return new Api($result->token);
        }
    }

    /**
     * Registers the user and returns an Api object
     * @param  string $username The user's username
     * @param  string $password The user's password (plain-text)
     * @param  string $email    The user's email
     * @return Api              Logged-in API
     */
    public static function register($username, $password, $email)
    {
        $result = self::fetch_api_resource('register', array(
                                                           'username' => $username,
                                                           'password' => $password,
                                                           'email' => $email), 'GET', FALSE);

        if (isset($result->error)) {
            throw new \Exception($result->error);
        } else {
            $_SESSION['api_user'] = $result->token;
            return new Api($result->token);
        }
    }

    ///////////////////////
    // Logged-in methods //
    ///////////////////////

    /**
     * Gets an object on the value of its primary key
     * @param  string $obj_type  The type of the object
     * @param  string $key_value The key value
     * @return Object            Object
     */
    public function user_get_object_by_key($obj_type, $key_value, $sortby = NULL)
    {

        return $this->user_fetch_api_resource($obj_type . '/' . $key_value, array('sortby' => $sortby));
    }

    /**
     * Deletes an object on the value of its primary key
     * @param  string $obj_type  The type of the object
     * @param  string $key_value The key value
     */
    public function user_update_object_by_key($obj_type, $key_value, $params)
    {
        $this->user_fetch_api_resource($obj_type . '/' . $key_value, $params, 'UPDATE');
    }

    /**
     * Deletes an object on the value of its primary key
     * @param  string $obj_type  The type of the object
     * @param  string $key_value The key value
     */
    public function user_delete_object_by_key($obj_type, $key_value)
    {
        $this->user_fetch_api_resource($obj_type . '/' . $key_value, array(), 'DELETE');
    }

    /**
     * Gets an object on the value of a secondary index
     * @param  string $obj_type  The type of the object
     * @param  string $key_name  The secondary index
     * @param  string $key_value The key value
     * @return Object            Object
     */
    public function user_get_object_by_secondary_key($obj_type, $key_name, $key_value, $sortby = NULL)
    {
        return $this->user_fetch_api_resource($obj_type . 'by' . $key_name . '/' . $key_value, array('sortby' => $sortby));
    }

    /**
     * Fetches an API endpoint as a logged-in user
     * @param  string   $endpoint Endpoint type
     * @param  [array]  $params   Params to pass
     * @param  [string] $type     HTTP verb (POST, GET, etc)
     * @param  [bool]   $isRest   TRUE if this should use the standard RESTful route, FALSE otherwise
     * @return array              JSON-decoded result
     */
    public function user_fetch_api_resource($endpoint, $params = array(), $type = 'GET', $isRest = TRUE)
    {
        // Add the token to the request
        $params['token'] = $this->token;

        return self::fetch_api_resource($endpoint, $params, $type, $isRest);
    }


    ////////////////////////
    // Logged-out methods //
    ////////////////////////

    /**
     * Gets an object on the value of its primary key
     * @param  string $obj_type  The type of the object
     * @param  string $key_value The key value
     * @return Object            Object
     */
    public static function get_object_by_key($obj_type, $key_value, $sortby = NULL)
    {
        return self::fetch_api_resource($obj_type . '/' . $key_value, array('sortby' => $sortby));
    }

    /**
     * Gets an object on the value of a secondary index
     * @param  string $obj_type  The type of the object
     * @param  string $key_name  The secondary index
     * @param  string $key_value The key value
     * @return Object            Object
     */
    public static function get_object_by_secondary_key($obj_type, $key_name, $key_value, $sortby = NULL)
    {
        return self::fetch_api_resource($obj_type . 'by' . $key_name . '/' . $key_value, array('sortby' => $sortby));
    }

    /**
     * Fetches an API endpoint
     * @param  string   $endpoint Endpoint type
     * @param  [array]  $params   Params to pass
     * @param  [string] $type     HTTP verb (POST, GET, etc)
     * @param  [bool]   $isRest   TRUE if this should use the standard RESTful route, FALSE otherwise
     * @return array              JSON-decoded result
     */
    public static function fetch_api_resource($endpoint, $params = array(), $type = 'GET', $isRest = TRUE)
    {
        // Build the URL
        if (self::$debug) {
            $url = self::base_debug;
        } else {
            $url = self::base;
        }

        if ($isRest) {
            $url .= strtolower($type) . '/';
        }

        $url .= $endpoint;

        if (substr($url, -1) == '/') {
            $url = substr($url, 0, strlen($url) - 1);
        }


        // Build the query string:
        $body = http_build_query($params);

        // Start the request
        $ch = curl_init();
        curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt ($ch, CURLOPT_USERAGENT, 'TapIn/PHP 1.0');

            // Set up the HTTP verb
            $type = strtoupper($type);
            switch ($type) {
                case "POST":
                case "UPDATE":
                case "PATCH":
                    curl_setopt ($ch, CURLOPT_POST, true);
                    curl_setopt ($ch, CURLOPT_POSTFIELDS, $body);
                    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
                    break;
                default:
                    $url .= '?' . $body;
                    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
                    break;
            }

        curl_setopt ($ch, CURLOPT_URL, $url);

        $content = curl_exec ($ch);
        curl_close ($ch);

        return json_decode($content);
    }
}
