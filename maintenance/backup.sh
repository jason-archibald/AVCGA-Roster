#!/bin/bash
set -e
if [[ $EUID -ne 0 ]]; then echo "ERROR: Run as root or with sudo." >&2; exit 1; fi

# Ensure we are always running from the project root
cd "$(dirname "$0")/.."

PROJECT_ROOT=$(pwd)
BACKUP_DIR="${PROJECT_ROOT}/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FINAL_BACKUP_FILE="${BACKUP_DIR}/avcga_backup_${TIMESTAMP}.tar.gz"
DB_DUMP_FILE_TEMP="${BACKUP_DIR}/db_dump_${TIMESTAMP}.sql"
ENV_FILE="backend/.env"

echo "--- Starting Full Project Backup ---"
mkdir -p "$BACKUP_DIR"

# --- THE CRITICAL FIX ---
# Load the .env file to make its variables available to this script
if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: ${ENV_FILE} not found. Cannot determine database credentials." >&2
    exit 1
fi
export $(grep -v '^#' "$ENV_FILE" | xargs)

echo "[1/4] Stopping application services for data consistency..."
# We no longer need --env-file because the variables are now in the shell environment
sudo docker compose stop backend member-web web-admin

echo "[2/4] Backing up PostgreSQL database as user '${DB_USER}'..."
# This command will now succeed because ${DB_USER} will expand correctly
sudo docker compose exec -T db pg_dumpall -U "${DB_USER}" > "${DB_DUMP_FILE_TEMP}"

echo "[3/4] Restarting all services..."
sudo docker compose up -d

echo "[4/4] Archiving project files and database dump..."
tar -czf "$FINAL_BACKUP_FILE" \
    --exclude='./backups' \
    --exclude='./provisioning_kit' \
    --exclude='**/node_modules' \
    --exclude='.git' \
    -C "$PROJECT_ROOT" . \
    -C "$BACKUP_DIR" "${DB_DUMP_FILE_TEMP##*/}"

# Rename the dump inside the archive for consistency and easier restores
# We need to install `tar` with --delete support if not present, or just keep the name
# For simplicity, we will assume standard tar. The restore script knows to look for this name.

# Clean up the temporary standalone DB dump file
rm "${DB_DUMP_FILE_TEMP}"

echo
echo "--- Backup Complete ---"
echo "Full project backup created at: ${FINAL_BACKUP_FILE}"
