#!/bin/bash
set -e
cd "$(dirname "$0")/.."

OUTPUT_DIR="provisioning_kit"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
KIT_FILE="${OUTPUT_DIR}/avcga_deployment_kit_${TIMESTAMP}.tar.gz"

echo "--- Creating Deployment Provisioning Kit ---"
mkdir -p "$OUTPUT_DIR"

# Create a temporary directory for building the kit
KIT_TEMP_DIR=$(mktemp -d)
echo "[1/3] Bundling project files..."

# Use rsync for powerful-but-simple directory copying with excludes
rsync -a --exclude 'backups/' --exclude 'provisioning_kit/' --exclude '**/node_modules/' --exclude '.git/' . "$KIT_TEMP_DIR/"

# Create a simple README for the kit
cat << KIT_README_EOF > "${KIT_TEMP_DIR}/README_DEPLOY.md"
# AVCGA CrewHub Deployment Kit

To deploy on a fresh Debian 12 server:
1. Extract this archive to /opt/
2. cd /opt/AVCGA-CrewHub
3. sudo ./scripts/setup-host.sh
4. Log out and log back in.
5. sudo ./scripts/reset-db.sh (Answer YES)
6. sudo ./scripts/activate-nginx.sh
KIT_README_EOF

echo "[2/3] Compressing deployment kit..."
tar -czf "$KIT_FILE" -C "$KIT_TEMP_DIR" .

echo "[3/3] Cleaning up..."
rm -rf "$KIT_TEMP_DIR"

echo "--- Provisioning Kit Created: ${KIT_FILE} ---"
