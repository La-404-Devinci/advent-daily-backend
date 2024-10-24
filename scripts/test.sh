#!/bin/bash
cd "$(dirname "$0")/.."

file="docker/compose.test.yml"

# Check if --ci flag is passed
if [ "$1" = "--ci" ]; then
    file="docker/compose.ci.test.yml"
fi

# Cleanup
echo "Cleaning up previous tests..."
docker compose -f $file rm -s -f -v

# Run tests
echo "Building and running tests..."
docker compose -f $file up --build -d --force-recreate --remove-orphans

echo "Attaching tests..."
docker compose -f $file attach test
result=$?

echo "Result: $result"

# Cleanup
echo "Cleaning up tests..."
docker compose -f $file rm -s -f -v

# Open coverage report
if [ "$1" != "--ci" ]; then
    echo "Opening coverage report..."
    open ./coverage/cov/lcov-report/index.html
fi

# Return result
exit $result
