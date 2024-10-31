#!/bin/bash
cd "$(dirname "$0")/.."

file="docker/compose.test.yml"
silent="false"

# Check if --ci flag is passed
if [ "$1" = "--ci" ]; then
    file="docker/compose.ci.test.yml"
fi

# Check if --silent flag is passed
if [ "$2" = "--silent" ]; then
    silent="true"
fi

out () {
    if [ "$silent" = "true" ]; then
        "$@" > /dev/null 2>&1
    else
        "$@"
    fi
}

# Cleanup
out echo "Cleaning up previous tests..."
out docker compose -f $file rm -s -f -v 

# Run tests
out echo "Building and running tests..."
SILENT=$silent out docker compose -f $file up --build -d --force-recreate --remove-orphans --renew-anon-volumes

out echo "Attaching tests..."
docker compose -f $file attach test
result=$?

out echo "Result: $result"

# Cleanup
out echo "Cleaning up tests..."
out docker compose -f $file rm -s -f -v

# Open coverage report
if [ "$1" != "--ci" ]; then
    echo "Opening coverage report..."
    open ./coverage/cov/lcov-report/index.html
fi

# Return result
exit $result
