#!/bin/bash
set -e
set -o pipefail

# ==============================================================================
# BACKUP PROJECT SOURCE CODE TO SMB SHARE
# ==============================================================================
#
# Purpose:      This script creates an archive of the project's source code
#               and configuration files (excluding Docker images, database data,
#               and node_modules) and copies it to a remote SMB share.
#
# IMPORTANT:    You MUST edit the "SMB CONFIGURATION" section below with your
#               network share's details before running this script.
#
# Usage:        Run this script with sudo after configuring your details.
#               Example: `sudo ./backup-source-to-smb.sh`
#
# ==============================================================================

if [[ $EUID -ne 0 ]]; then echo "ERROR: This script must be run with sudo."; exit 1; fi

# --- SMB CONFIGURATION - EDIT THIS SECTION ---
# The IP address or hostname of your NAS or Windows server
SMB_SERVER_IP="10.0.0.2" # <--- EDIT THIS! e.g., "192.168.1.100" or "nas.local"
# The name of the shared folder on that server
SMB_SHARE_NAME="backup"
# The username required to access the share
SMB_USERNAME="jason"
# The password for that user
SMB_PASSWORD='Archie1977'

# --- SCRIPT CONFIGURATION (Usually no need to edit) ---
PROJECT_ROOT="/opt/AVCGA-CrewHub"
MOUNT_POINT="/mnt/smb_project_backup" # A temporary directory to mount the share
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILENAME="avcga_source_backup_${TIMESTAMP}.tar.gz"
TEMP_BACKUP_PATH="/tmp/${BACKUP_FILENAME}"


# --- Pre-run check ---
if [ "$SMB_SERVER_IP" == "YOUR_SERVER_IP_HERE" ]; then
    echo "ERROR: Please edit this script and set the SMB_SERVER_IP variable." >&2
    exit 1
fi
if ! command -v rsync &> /dev/null; then
    echo "rsync could not be found. Please install it with 'sudo apt-get install rsync'." >&2
    exit 1
fi
if ! command -v tar &> /dev/null; then
    echo "tar could not be found. Please install it with 'sudo apt-get install tar'." >&2
    exit 1
fi


echo "========================================"
echo "Starting Project Source Code Backup to SMB Share"
echo "Target: //${SMB_SERVER_IP}/${SMB_SHARE_NAME}"
echo "========================================"

# --- Step 1: Create the Source Code Archive ---
echo "--> [1/4] Creating source code archive..."
# We use 'tar' to create a compressed archive.
# The --exclude flags are critical for keeping the backup clean and small.
tar -czf "$TEMP_BACKUP_PATH" \
    --exclude='**/node_modules' \
    --exclude='./backups' \
    --exclude='./provisioning_kit' \
    --exclude='.git' \
    -C "$PROJECT_ROOT" .

echo "Source code archive created at ${TEMP_BACKUP_PATH}"

# --- Step 2: Prepare and Mount the SMB Share ---
echo "--> [2/4] Preparing and mounting the SMB share..."
# Create the mount point directory if it doesn't exist
mkdir -p "$MOUNT_POINT"
# Unmount any previous attempt just in case it's stuck
umount "$MOUNT_POINT" &> /dev/null || true

# Mount the SMB share using the credentials
echo "Mounting share..."
mount -t cifs "//${SMB_SERVER_IP}/${SMB_SHARE_NAME}" "$MOUNT_POINT" -o username="$SMB_USERNAME",password="$SMB_PASSWORD",vers=3.0

# --- Step 3: Copy the Backup File ---
echo "--> [3/4] Copying backup file to the network share..."
# Use rsync for a nice progress bar and robust copying
rsync -avh --progress "$TEMP_BACKUP_PATH" "$MOUNT_POINT/"

# --- Step 4: Unmount the Share and Clean Up ---
echo "--> [4/4] Unmounting the SMB share and cleaning up..."
umount "$MOUNT_POINT"
echo "Share unmounted."
rm "$TEMP_BACKUP_PATH"
echo "Temporary local archive removed."

echo
echo "========================================"
echo "Source Code Backup to SMB Share Complete!"
echo "========================================"
echo "File '${BACKUP_FILENAME}' has been successfully copied to your network share."
echo
