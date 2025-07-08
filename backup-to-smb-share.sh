#!/bin/bash
set -e
set -o pipefail

# ==============================================================================
# BACKUP PROJECT TO SMB SHARE
# ==============================================================================
#
# Purpose:      This script performs a full backup of the AVCGA CrewHub project
#               and copies the final archive to a remote SMB network share.
#
#               It assumes the project is located at /opt/AVCGA-CrewHub and
#               that the `maintenance/backup.sh` script exists.
#
# Usage:        Run this script with sudo after configuring your server IP.
#               Example: `sudo ./backup-to-smb-share.sh`
#
# ==============================================================================

if [[ $EUID -ne 0 ]]; then echo "ERROR: This script must be run with sudo."; exit 1; fi

# --- SMB CONFIGURATION - EDIT THE SERVER IP ---
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
LOCAL_BACKUP_DIR="${PROJECT_ROOT}/backups"
MOUNT_POINT="/mnt/avcga_backup" # A temporary directory to mount the share

# --- Pre-run check ---
if [ "$SMB_SERVER_IP" == "YOUR_SERVER_IP_HERE" ]; then
    echo "ERROR: Please edit this script and set the SMB_SERVER_IP variable." >&2
    exit 1
fi
if ! command -v rsync &> /dev/null; then
    echo "rsync could not be found. Please install it with 'sudo apt-get install rsync'." >&2
    exit 1
fi

cd "$PROJECT_ROOT" || { echo "ERROR: Could not cd to project root at ${PROJECT_ROOT}."; exit 1; }

echo "========================================"
echo "Starting Project Backup to SMB Share"
echo "Target: //${SMB_SERVER_IP}/${SMB_SHARE_NAME}"
echo "========================================"

# --- Step 1: Perform the Local Backup ---
echo "--> [1/4] Performing local project backup..."
if [ ! -f "maintenance/backup.sh" ]; then
    echo "ERROR: The local backup script 'maintenance/backup.sh' was not found." >&2
    exit 1
fi
# Running the script will create a new .tar.gz file in the backups/ directory
bash "maintenance/backup.sh"

# Find the newest backup file to copy
BACKUP_FILE=$(ls -t "${LOCAL_BACKUP_DIR}"/*.tar.gz | head -n 1)
if [ -z "$BACKUP_FILE" ]; then
    echo "ERROR: No backup file was found after running the local backup script." >&2
    exit 1
fi
echo "Local backup created: ${BACKUP_FILE##*/}"

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
rsync -avh --progress "$BACKUP_FILE" "$MOUNT_POINT/"

# --- Step 4: Unmount the Share and Clean Up ---
echo "--> [4/4] Unmounting the SMB share..."
umount "$MOUNT_POINT"
echo "Share unmounted."

echo
echo "========================================"
echo "Backup to SMB Share Complete!"
echo "========================================"
echo "File '${BACKUP_FILE##*/}' has been successfully copied to your network share."
echo
