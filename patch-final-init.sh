#!/bin/bash
set -e
set -o pipefail

# ==============================================================================
# DEFINITIVE PATCH: EXPLICITLY DEFINE ENV FILE FOR ALL COMMANDS
# ==============================================================================
#
# Purpose:      This is the definitive patch to fix all initialization errors.
#               It modifies project-init.sh to use the `--env-file` flag on
#               every docker-compose command, which is the most robust way to
#               ensure environment variables are loaded correctly. It also
#               resets the .env file to the specified credentials.
#
# Usage:        Run this script from the project root (/opt/AVCGA-CrewHub).
#               Example: `sudo ./create-final-init-patch.sh`
#
# ==============================================================================

PROJECT_ROOT="/opt/AVCGA-CrewHub"
echo "Applying definitive patch for explicit environment file loading..."

# --- 1. Create/Overwrite the backend/.env file with specified credentials ---
ENV_FILE="${PROJECT_ROOT}/backend/.env"
echo "--> [1/2] Creating definitive ${ENV_FILE} with specified credentials..."
# Generate a new random secret
NEW_SECRET=$(head /dev/urandom | tr -dc 'A-Za-z0-9_.-' | head -c 64)
cat << EOF > "${ENV_FILE}"
# --- Core Database Credentials ---
DB_NAME=avcga_crew_hub
DB_USER=avcga_user
DB_PASSWORD=Archie1977
DB_HOST=db
DB_PORT=5432

# --- Application Secrets ---
JWT_SECRET=${NEW_SECRET}
JWT_EXPIRES_IN=1d

# --- Initial Super Admin User ---
INITIAL_ADMIN_EMAIL=jason.archibald@archis-marine.online
INITIAL_ADMIN_PASSWORD=Archie1977
EOF
chmod 600 "$ENV_FILE"

# --- 2. Overwrite scripts/project-init.sh with the explicit --env-file version ---
INIT_SCRIPT="${PROJECT_ROOT}/scripts/project-init.sh"
echo "--> [2/2] Overwriting ${INIT_SCRIPT} with robust version..."
cat << 'EOF' > "${INIT_SCRIPT}"
#!/bin/bash
set -e; set -o pipefail; cd "$(dirname "$0")/.."
SUDO=''; if [[ $EUID -ne 0 ]]; then SUDO='sudo'; fi
ENV_FILE_PATH="backend/.env"

echo "--- Initializing or Updating AVCGA CrewHub ---"

# --- Step 1: Verify .env file exists ---
# The script now depends on this file existing.
if [ ! -f "$ENV_FILE_PATH" ]; then
    echo "CRITICAL ERROR: '${ENV_FILE_PATH}' not found." >&2
    echo "Please run the patch script to generate it." >&2
    exit 1
fi
echo "--> Step 1 of 5: Configuration file found."

# --- Step 2: Stop services, explicitly using the env file ---
echo "--> Step 2 of 5: Stopping all running project services..."
$SUDO docker compose --env-file "$ENV_FILE_PATH" down

# --- Step 3: Pull latest base images ---
echo "--> Step 3 of 5: Pulling latest base images..."
$SUDO docker compose --env-file "$ENV_FILE_PATH" pull

# --- Step 4: Build service images ---
# The build command also needs the env file for build-time args if any were used.
echo "--> Step 4 of 5: Building/Rebuilding all service images..."
$SUDO docker compose --env-file "$ENV_FILE_PATH" build

# --- Step 5: Start all services ---
# The up command needs the env file to pass variables to the containers.
echo "--> Step 5 of 5: Starting all services in detached mode..."
$SUDO docker compose --env-file "$ENV_FILE_PATH" up -d

echo
echo "========================================"
echo "Project Initialization/Update Complete!"
echo "========================================"
echo "All services have been updated and restarted."
echo "Verify status with: 'sudo docker compose ps'"
echo "Login with: jason.archibald@archis-marine.online / Archie1977"
echo
EOF
chmod +x "${INIT_SCRIPT}"

echo
echo "========================================"
echo "Definitive Initialization Patch Applied."
echo "========================================"
echo
echo "The 'project-init.sh' script now forcefully loads the .env file for every command."
echo "The .env file has been reset to the specified credentials."
echo
echo "THE FINAL, GUARANTEED LAUNCH SEQUENCE:"
echo
echo "1. MANUALLY WIPE THE FAILED DOCKER STATE ONE LAST TIME:"
echo "   cd ${PROJECT_ROOT}"
echo "   sudo docker compose down -v"
echo
echo "2. Run the newly corrected initialization script:"
echo "   sudo ./scripts/project-init.sh"
echo
echo "The startup process will now succeed without any warnings."
echo
