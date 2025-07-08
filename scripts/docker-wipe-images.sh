#!/bin/bash
set -e
set -o pipefail

# ==============================================================================
# SCRIPT TO STOP ALL DOCKER CONTAINERS AND DELETE ALL DOCKER IMAGES
# ==============================================================================
#
# WARNING: THIS IS A DESTRUCTIVE OPERATION.
# It will stop all running containers and permanently delete every Docker
# image on this system. This action cannot be undone.
#
# Usage:        Run this script with sudo to perform a full Docker image wipe.
#               Example: `sudo ./docker-wipe-images.sh`
#
# ==============================================================================

if [[ $EUID -ne 0 ]]; then
    echo "ERROR: This script must be run with sudo." >&2
    exit 1
fi

echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
echo "!!!                      W A R N I N G                         !!!"
echo "!!! You are about to STOP all running Docker containers and    !!!"
echo "!!! PERMANENTLY DELETE ALL Docker images on this system.       !!!"
echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
echo
read -p "Are you absolutely sure you want to proceed? Type 'YES' to continue: " CONFIRM
if [ "$CONFIRM" != "YES" ]; then
    echo "Operation cancelled by user."
    exit 0
fi

echo
echo "========================================"
echo "Starting Docker Stop and Wipe Process..."
echo "========================================"

# --- Step 1: Stop All Running Containers ---
echo "--> [1/3] Stopping all running Docker containers..."
# `docker ps -q` lists the IDs of all running containers.
# If the list is not empty, pass it to `docker stop`.
RUNNING_CONTAINERS=$(docker ps -q)
if [ -n "$RUNNING_CONTAINERS" ]; then
    docker stop $RUNNING_CONTAINERS
    echo "All running containers have been stopped."
else
    echo "No running containers found to stop."
fi

# --- Step 2: Remove All Containers (Stopped and Running) ---
echo "--> [2/3] Removing all containers..."
# `docker ps -a -q` lists the IDs of ALL containers, including stopped ones.
ALL_CONTAINERS=$(docker ps -a -q)
if [ -n "$ALL_CONTAINERS" ]; then
    docker rm $ALL_CONTAINERS
    echo "All containers have been removed."
else
    echo "No containers found to remove."
fi

# --- Step 3: Delete All Docker Images ---
echo "--> [3/3] Deleting ALL Docker images..."
# `docker images -q` lists the IDs of ALL images on the system.
ALL_IMAGES=$(docker images -q)
if [ -n "$ALL_IMAGES" ]; then
    # The -f flag forces removal even if images are tagged in multiple repositories.
    docker rmi -f $ALL_IMAGES
    echo "All Docker images have been deleted."
else
    echo "No Docker images found to delete."
fi


echo
echo "========================================"
echo "Docker Stop and Wipe Process Complete."
echo "========================================"
echo "All containers have been stopped and removed."
echo "All Docker images have been deleted from the system."
echo
