#!/bin/bash

# Install webpy
echo "--> Installing Apache, PHP, and friends"
apt-get install -y apache2 php5 libapache2-mod-php5 php5-curl

echo "--> Enabling mod_rewrite"
a2enmod rewrite

echo "--> Setting up the site"
echo '<VirtualHost *:80>
        ServerName tapin.tv
        ServerAlias *.tapin.tv

        DocumentRoot /var/www
        <Directory /var/www/>
                Options FollowSymLinks
                AllowOverride All
        </Directory>
</VirtualHost>' > /etc/apache2/sites-available/000-default

echo "--> Restarting apache"
service apache2 restart
