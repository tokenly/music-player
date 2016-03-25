#!/bin/bash

set -e

echo; echo "compiling assets"
DIR=`pwd`
cd src;
npm install;
./node_modules/webpack/bin/webpack.js
cd $DIR
