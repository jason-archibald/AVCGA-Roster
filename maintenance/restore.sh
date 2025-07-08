#!/bin/bash
set -e
if [[ $EUID -ne 0 ]]; then echo "ERROR: Run as root or with sudo." >&2; exit 1; fi
cd "$(dirname "$0")/.."

if [ -z "$1" ]; then
    echo "Usage: sudo $0 <path-to-backup.tar.gz>" >&2
    exit 1
fi
BACKUP_PATH="$1"
if [ ! -f "$BACKUP_PATH" ]; then
    echo "ERROR: Backup file '$BACKUP_PATH' not found." >&2; exit 1
fi

echo "!!! WARNING: This will PERMANENTLY DELETE all current application code and data."
read -p "!!! Are you sure you want to restore from ${BACKUP_PATH}? Type 'YES' to continue: " CONFIRM
if [[ "$CONFIRM" != "YES" ]]; then echo "Restore cancelled."; exit 0; fi

echo "--- Starting Full Project Restore ---"
ENV_FILE="backend/.env" # Define for docker-compose

echo "[1/4] Stopping all services and removing volumes..."
sudo docker compose --env-file "$ENV_FILE" down -v

echo "[2/4] Clearing existing project directory and extracting backup..."
# Create a temporary directory for extraction
RESTORE_TEMP_DIR=$(mktemp -d)
tar -xzf "$BACKUP_PATH" -C "$RESTORE_TEMP_DIR"
# Clear out the old project directory (except for the backups folder itself)
find . -maxdepth 1 -not -name "." -not -name "backups" -not -name "provisioning_kit" -exec rm -rf {} +
# Move the restored files into the project directory
mv "$RESTORE_TEMP_DIR"/* .
rm -rf "$RESTORE_TEMP_DIR"

# The database dump is now at the root of the project from the archive.
# We must move it to the correct sql directory to be picked up by the init process.
echo "[3/4] Preparing database dump for initialization..."
if [ -f "database.sql" ]; then # Name given during backup
    mkdir -p backend/sql
    mv "database.sql" backend/sql/00_init.sql # Name it to run first
else
    # Look for any .sql file if the rename failed
    DB_DUMP=$(find . -maxdepth 1 -name "*.sql")
    if [ -n "$DB_DUMP" ]; then
        mkdir -p backend/sql
        mv "$DB_DUMP" backend/sql/00_init.sql
    else
        echo "WARNING: No database.sql found in archive. DB may not be restored."
    fi
fi

echo "[4/4] Re-initializing project from restored files..."
sudo ./scripts/project-init.sh

echo "--- Restore Complete ---"
