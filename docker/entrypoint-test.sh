#!/bin/sh

rm ./coverage/* ./logs/* -rf

sleep 2

# Pass --silent flag to jest if SILENT env var is set
if [ "$SILENT" = "true" ]; then
    SILENT_ARG="--silent"
else
    SILENT_ARG=""
fi

npx jest $SILENT_ARG
