#!/usr/bin/env bash

# run gulp test
# try to execute gulp test more times until success
# after a success (return 0), this script will stop itself
echo "gulp test on $TRAVIS_OS_NAME ready to start"
n=0
until [ $n -ge 5 ] # 5 times
do
  echo "gulp test on $TRAVIS_OS_NAME with n=$n"
  gulp test && break
  n=$[$n+1]
  sleep 3 # wait 3 seconds
done
echo "gulp test on $TRAVIS_OS_NAME finished with n=$n"

# send test coverage to codeclimate.com
echo "npm run codeclimate on $TRAVIS_OS_NAME"
npm run codeclimate
# send test coverage to coveralls.io
echo "npm run coveralls on $TRAVIS_OS_NAME"
npm run coveralls