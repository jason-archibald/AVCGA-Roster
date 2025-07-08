#!/bin/bash
set -e; cd "$(dirname "$0")/.."
echo "--- Building Frontend Assets ---"
echo "[1/2] Building Member Web Portal..."
sudo docker run --rm -v "$(pwd)/member-web":/app -w /app node:20-alpine sh -c "npm install && npm run build"
echo "[2/2] Building Admin Web Portal..."
sudo docker run --rm -v "$(pwd)/web-admin":/app -w /app node:20-alpine sh -c "npm install && npm run build"
echo "--- Frontend Asset Build Complete ---"
