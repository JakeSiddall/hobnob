#!/usr/bin/env bash
<<<<<<< HEAD
=======

# Make sure the port is not already bound
>>>>>>> ec939164bbe2d30e1063c3b586f2456b29e38522
if ss -lnt | grep -q :$SERVER_PORT; then
  echo "Another process is already listening to port $SERVER_PORT"
  exit 1;
fi
<<<<<<< HEAD
RETRY_INTERVAL=${RETRY_INTERVAL:-0.2}
if ! systemctl is-active --quiet elasticsearch.service; then
  sudo systemctl start elasticsearch.service
=======

RETRY_INTERVAL=${RETRY_INTERVAL:-0.2}
if ! systemctl --quiet is-active elasticsearch.service; then
  sudo systemctl start elasticsearch.service
  # Wait until Elasticsearch is ready to respond
>>>>>>> ec939164bbe2d30e1063c3b586f2456b29e38522
  until curl --silent $ELASTICSEARCH_HOSTNAME:$ELASTICSEARCH_PORT -w "" -o /dev/null; do
    sleep $RETRY_INTERVAL
  done
fi
<<<<<<< HEAD
# Clean the test index (if it exists)
curl --silent -o /dev/null -X DELETE "$ELASTICSEARCH_HOSTNAME:$ELASTICSEARCH_PORT/$ELASTICSEARCH_INDEX"

yarn run test:serve &
until ss -lnt | grep -q :$SERVER_PORT; do
  sleep $RETRY_INTERVAL
done
npx cucumber-js spec/cucumber/features --require-module @babel/register --require spec/cucumber/steps
=======

# Run our API server as a background process
yarn run serve &
RETRY_INTERVAL=0.2
until ss -lnt | grep -q :$SERVER_PORT; do
  sleep $RETRY_INTERVAL
done
# Run test
npx cucumber-js spec/cucumber/features --require-module @babel/register --require spec/cucumber/steps
# Terminate all processes within the same process group by sending a SIGTERM signal
>>>>>>> ec939164bbe2d30e1063c3b586f2456b29e38522
kill -15 0