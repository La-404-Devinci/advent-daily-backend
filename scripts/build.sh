#!/bin/bash
set -e
cd "$(dirname "$0")/.."

# Check if arguments are passed
if [ $# -eq 0 ]; then
  echo "Usage: $0 <image_name>"
  exit 1
fi

# Build the docker image
docker build --target=production -t $1 .
