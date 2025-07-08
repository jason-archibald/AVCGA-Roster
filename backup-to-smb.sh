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
# IMPORTANT:    You MUST edit the "SMB CONFIGURATION" section below with your
#               network share's details before running this script.
#
# Usage:        Run this script with sudo after configuring your details.
#               Example: `sudo ./backup-to-smb.sh`
#
# ==============================================================================

if [[ $EUID -ne 0 ]]; then echo "ERROR: This script must be run with sudo."; exit 1; fi

# --- SMB CONFIGURATION - EDIT THIS SECTION ---
# The IP address or hostname of your NAS or Windows server
SMB_SERVER_IP="10.0.0.3"
# The name of the shared folder on that server
SMB_SHARE_NAME="Backups"
# The username required to access the share
SMB_USERNAME="jason"
# The password for that user. IMPORTANT: For security, create a dedicated,
# limited-access user on your NAS just for backups.
SMB_PASSWORD='Archie1977'

# --- SCRIPT CONFIGURATION (Usually no need to edit) ---
PROJECT_ROOT="/opt/AVCGA-CrewHub"
LOCAL_BACKUP_DIR="${PROJECT_ROOT}/backups"
MOUNT_POINT="/mnt/smb_backup" # A temporary directory to mount the share

# --- Main Script Logic ---
cd "$PROJECT_ROOT" || { echo "ERROR: Could not cd to project root."; exit 1; }

echo "========================================"
echo "Starting Project Backup to SMB Share"
echo "========================================"

# --- Step 1: Perform the Local Backup ---
echo "--> [1/4] Performing local project backup..."
# We will call the existing maintenance script to create the local backup file
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
echo "Local backup created: ${BACKUP_FILE}"

# --- Step 2: Prepare and Mount the SMB Share ---
echo "--> [2/4] Preparing and mounting the SMB share..."
# Create the mount point directory if it doesn't exist
mkdir -p "$MOUNT_POINT"
# Unmount any previous attempt just in case it's stuck
umount "$MOUNT_POINT" &> /dev/null || true

# Mount the SMB share using the credentials
echo "Mounting //${SMB_SERVER_IP}/${SMB_SHARE_NAME} to ${MOUNT_POINT}..."
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
