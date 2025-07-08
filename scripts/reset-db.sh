#!/bin/bash
set -e; cd "$(dirname "$0")/.."
echo "!!! WARNING: You are about to PERMANENTLY DELETE all database data."
read -p "!!! Type 'YES' to continue: " CONFIRM
if [ "$CONFIRM" != "YES" ]; then echo "Reset cancelled."; exit 0; fi
echo "--- Performing Full Database Reset ---"
sudo docker compose down -v
echo "--- Starting fresh... ---"
sudo ./scripts/project-init.sh
echo "--- Full Database Reset Complete! ---"
