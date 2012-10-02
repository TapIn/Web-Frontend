#!/bin/bash

if [ $USERDATA == "prod" ]
then
    echo "--> Registering with load balancer"
    elb-register-instances-with-lb --lb www-tapin-tv --region us-west-1 --instances $AMI_ID
fi
