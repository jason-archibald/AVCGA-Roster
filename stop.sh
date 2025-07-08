#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "=== Stopping AVCGA CrewHub System ==="

# Check if .env exists
ENV_FILE="backend/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "WARNING: $ENV_FILE not found. Using default docker compose commands."
    sudo docker compose down
else
    echo "[1/1] Stopping Docker services..."
    sudo docker compose --env-file "$ENV_FILE" down
fi

echo
echo "=== System Stopped Successfully ==="
echo "To start again, run: ./start.sh"
