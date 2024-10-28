#!/bin/bash
set -e
cd "$(dirname "$0")/.."

docker compose -f docker/compose.dev.yml up --build --force-recreate --remove-orphans --renew-anon-volumes
