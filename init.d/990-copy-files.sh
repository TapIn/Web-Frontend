#!/bin/bash

rm /var/www
cp /tmp/bootstrap/stage3 /var/www

rm -rf /var/www/init.d


echo '[app]
static=/assets
thumbs=http://thumbs.tapin.tv
path=
download_app=http://itunes.apple.com/us/app/tapin.tv/id540925404
debug=false

[mixpanel]
token=a85073e95810f6d2823beee9c85996a9' > /var/www/local.ini
