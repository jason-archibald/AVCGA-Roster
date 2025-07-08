#!/bin/bash
set -e
set -o pipefail

# Change directory to the project root (one level up from scripts/)
cd "$(dirname "$0")/.."

SUDO='';
if [[ $EUID -ne 0 ]]; then
    SUDO='sudo';
fi

ENV_FILE="backend/.env"

echo "--- Initializing or Updating AVCGA CrewHub ---"

# --- STEP 1: Verify/Create .env file BEFORE any docker command ---
# This is the critical fix to eliminate "variable not set" warnings.
echo "--> Step 1 of 5: Verifying configuration..."
if [ ! -f "$ENV_FILE" ]; then
    echo "WARNING: '${ENV_FILE}' not found. Creating a default version."
    # Generate a secure, random JWT secret using a shell-safe character set
    JWT_SECRET=$(head /dev/urandom | tr -dc 'A-Za-z0-9_.-' | head -c 64)
    cat << ENV_EOF > "$ENV_FILE"
DB_NAME=avcga_crew_hub
DB_USER=avcga_user
DB_PASSWORD=Password123
DB_HOST=db
DB_PORT=5432
JWT_SECRET=${JWT_SECRET}
INITIAL_ADMIN_EMAIL=jason.archibald@archis-marine.online
INITIAL_ADMIN_PASSWORD=Password123
ENV_EOF
    chmod 600 "$ENV_FILE"
fi

# --- STEP 2: Stop any running services ---
echo "--> Step 2 of 5: Stopping all running project services..."
# We MUST use --env-file for all commands now.
$SUDO docker compose --env-file "$ENV_FILE" down

# --- STEP 3: Build service images ---
echo "--> Step 3 of 5: Building/Rebuilding all service images..."
$SUDO docker compose --env-file "$ENV_FILE" build

# --- STEP 4: Pull latest base images ---
echo "--> Step 4 of 5: Pulling latest base images..."
$SUDO docker compose --env-file "$ENV_FILE" pull

# --- STEP 5: Start all services ---
echo "--> Step 5 of 5: Starting all services in detached mode..."
$SUDO docker compose --env-file "$ENV_FILE" up -d

echo "--- Project Update Complete. Verify status with 'sudo docker compose ps' ---"
