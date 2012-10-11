#!/bin/bash
echo "--> Moving logger"
cp -r /tmp/bootstrap/stage3/logger /etc

echo "--> Installing crontab"
crontab -l > mycron
echo '* * * * * python /etc/logger/logger.py
* * * * * ( sleep 30 ; python /etc/logger/logger.py )' >> mycron
crontab mycron
rm mycron

echo "--> Moving web dir"
rm -rf /var/www
cp -r /tmp/bootstrap/stage3 /var/www

echo "--> Removing useless stuff"
rm -rf /var/www/init.d
rm -rf /var/www/logger

echo '[app]
static=/assets
thumbs=http://thumbs.tapin.tv
path=
download_app=http://itunes.apple.com/us/app/tapin.tv/id540925404
debug=false

[mixpanel]
token=a85073e95810f6d2823beee9c85996a9' > /var/www/local.ini
