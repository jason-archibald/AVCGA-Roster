#!/bin/bash
set -e; cd "$(dirname "$0")/.."
PROJECT_CONFIG_NAME="crew-hub.conf"
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"
echo "--- Activating Nginx Reverse Proxy ---"
echo "[1/4] Copying config to ${NGINX_SITES_AVAILABLE}..."
sudo cp "nginx-sample.conf" "${NGINX_SITES_AVAILABLE}/${PROJECT_CONFIG_NAME}"
if [ -L "${NGINX_SITES_ENABLED}/default" ]; then
    echo "[2/4] Removing default Nginx site..."
    sudo rm "${NGINX_SITES_ENABLED}/default"
fi
echo "[3/4] Enabling project site..."
sudo ln -sf "${NGINX_SITES_AVAILABLE}/${PROJECT_CONFIG_NAME}" "${NGINX_SITES_ENABLED}/"
echo "[4/4] Testing and reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx
echo "--- Nginx Activation Complete ---"
