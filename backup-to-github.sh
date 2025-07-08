#!/bin/bash
set -e
set -o pipefail

# ==============================================================================
# BACKUP PROJECT SOURCE CODE TO GITHUB
# ==============================================================================
#
# Purpose:      This script automates the process of backing up the project's
#               source code to its configured GitHub repository. It adds all
#               changes, creates a commit with a timestamp, and pushes to the
#               'main' branch.
#
# Prerequisite: The project directory must be a git repository and have a remote
#               named 'origin' pointing to your GitHub repository.
#
# Usage:        Run this script with sudo after making changes to the project.
#               Example: `sudo ./backup-to-github.sh`
#
# ==============================================================================

if [[ $EUID -ne 0 ]]; then echo "ERROR: This script must be run with sudo."; exit 1; fi

# --- SCRIPT CONFIGURATION ---
PROJECT_ROOT="/opt/AVCGA-CrewHub"
COMMIT_MESSAGE="Automated backup: $(date +'%Y-%m-%d %H:%M:%S')"

cd "$PROJECT_ROOT" || { echo "ERROR: Could not cd to project root."; exit 1; }

echo "========================================"
echo "Starting Project Backup to GitHub"
echo "========================================"

# --- Step 1: Check for .gitignore file ---
GITIGNORE_FILE=".gitignore"
if [ ! -f "$GITIGNORE_FILE" ]; then
    echo "--> [1/4] WARNING: .gitignore file not found. Creating a default one."
    # This is a good default for Node.js projects to avoid committing junk
    cat << EOF > "$GITIGNORE_FILE"
# Dependencies
/node_modules
/.pnp
.pnp.js

# Production
/dist
/build

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Backups and Kits
/backups/
/provisioning_kit/
EOF
    echo "Default .gitignore created. Please review and commit it."
fi


# --- Step 2: Add all changes to the staging area ---
echo "--> [2/4] Staging all changes for commit..."
git add .

# --- Step 3: Commit the changes ---
# Use --allow-empty in case no files changed but a backup was requested.
echo "--> [3/4] Committing changes with message: \"${COMMIT_MESSAGE}\""
git commit -m "${COMMIT_MESSAGE}" --allow-empty

# --- Step 4: Push the commit to the remote repository ---
echo "--> [4/4] Pushing changes to the 'origin' remote..."
# The -u flag sets the upstream branch for future pushes.
git push origin main

echo
echo "========================================"
echo "Backup to GitHub Complete!"
echo "========================================"
echo "All local changes have been successfully pushed to your GitHub repository."
echo
