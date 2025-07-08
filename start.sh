#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "=== Starting AVCGA CrewHub System ==="

# Check if .env exists
ENV_FILE="backend/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: $ENV_FILE not found. Run ./scripts/project-init.sh first." >&2
    exit 1
fi

echo "[1/2] Starting Docker services..."
sudo docker compose --env-file "$ENV_FILE" up -d

echo "[2/2] Ensuring Nginx is running..."
sudo systemctl start nginx
sudo systemctl enable nginx

echo
echo "=== System Started Successfully ==="
echo "Member Portal: http://localhost/ or http://your-server-ip/"
echo "Admin Portal:  http://localhost/admin/ or http://your-server-ip/admin/"
echo
echo "Check status with: sudo docker compose ps"
