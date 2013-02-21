<?php

namespace FSStack\TapIn\Controllers;

use \FSStack\TapIn\Models;

class export extends \CuteControllers\Base\Rest {

    function get_index() {
        set_time_limit(10000);
        $user = new Models\User($this->request->request('username'));
        $email = $this->request->request('email');
        error_log(var_export($email, TRUE));
        if (empty($email)) {
            return "Failed";
        }

        foreach ($user->videos as $video) {
            if (!($user->is_live && $video->streamid === $user->live->streamid)) {
                $files[] = '/mnt/content.tapin.tv/' . $video->streamid . '/stream.mp4';
            }
        }

        $outputBase = 'content.tapin.tv/export/' . 'tapintv_' . $user->userID . '.zip';
        $outputPath = '/mnt/' . $outputBase;
        $outputURL = 'http://' . $outputBase;

        if ($this->create_zip($files, $outputPath, true)) {
            $this->send_export_email($user->userID, $email, $outputURL);
            return $outputURL;
        } else {
            return "Failed";
        }    
    }


    /* creates a compressed zip file (http://davidwalsh.name/create-zip-php) */
    function create_zip($files = array(), $destination = '', $overwrite = false) {
        //if the zip file already exists and overwrite is false, return false
        if(file_exists($destination) && !$overwrite) { return false; }
        //vars
        $valid_files = array();
        //if files were passed in...
        if(is_array($files)) {
        //cycle through each file
            foreach($files as $file) {
                //make sure the file exists
                if(file_exists($file)) {
                    $valid_files[] = $file;
                }
            }
        }
        //if we have good files...
        if (count($valid_files)) {
            //create the archive
            $zip = new \ZipArchive();
            if($zip->open($destination,$overwrite ? \ZIPARCHIVE::OVERWRITE : \ZIPARCHIVE::CREATE) !== true) {
                return false;
            }
            //add the files
            foreach($valid_files as $file) {
                $exploded = explode('/', $file);
                $filename = $exploded[3] . '.mp4';
                $zip->addFile($file,$filename);
            }
            //debug
            //echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;

            //close the zip -- done!
            $zip->close();

            //check to make sure the file exists
            return file_exists($destination);

        } else {
            return false;
        }
    }

    function send_export_email($username, $email, $link) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($ch, CURLOPT_USERPWD, 'api:key-2yr57-9w8bma6v1mfw30nabg49iu9c-2');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_URL, 'https://api.mailgun.net/v2/robot.tapin.tv/messages');
        curl_setopt($ch, CURLOPT_POSTFIELDS, array(
                                                    'from' => 'TapIn Robot <export@robot.tapin.tv>',
                                                    'to' => $email,
                                                    'subject' => 'Lo, there it is!',
                                                    'text' => 'Hi ' . $username . ",\n\n" . "We took all your videos, zipped them together, and now they're ready for you! Use the link below:\n\n" . $link . "\n\nBeepboop,\nThe TapIn.tv Export-O-Matic Robot\n"));
        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }
}
?>