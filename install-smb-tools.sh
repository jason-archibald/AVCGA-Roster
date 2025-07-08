#!/bin/bash
set -e
set -o pipefail

# ==============================================================================
# INSTALL SMB/CIFS CLIENT TOOLS
# ==============================================================================
#
# Purpose:      This script installs the necessary tools (`cifs-utils`) on a
#               Debian-based system to allow it to connect to and mount
#               SMB (Windows/NAS) network shares.
#
# Usage:        Run this script once with sudo to prepare the server.
#               Example: `sudo ./install-smb-tools.sh`
#
# ==============================================================================

if [[ $EUID -ne 0 ]]; then echo "ERROR: This script must be run with sudo."; exit 1; fi

echo "========================================"
echo "Installing SMB/CIFS Client Tools..."
echo "========================================"

echo "--> Updating package lists..."
apt-get update

echo "--> Installing 'cifs-utils'..."
# -y flag automatically answers yes to prompts
apt-get install -y cifs-utils

echo
echo "========================================"
echo "Installation Complete."
echo "========================================"
echo "The system is now capable of mounting SMB network shares."
echo
