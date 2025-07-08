#!/bin/bash
set -e
set -o pipefail

# Change to the project root directory to ensure paths are correct
cd "$(dirname "$0")/.."

echo "--- Verifying Super Admin in Database ---"

# Define the path to the environment file
ENV_FILE="backend/.env"

# Check if the .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: ${ENV_FILE} not found. Cannot determine database credentials." >&2
    exit 1
fi

# Source the .env file to load its variables into the script's environment
# Use a subshell to avoid polluting the user's current shell
DB_USER=$(grep DB_USER "$ENV_FILE" | cut -d '=' -f 2)
DB_NAME=$(grep DB_NAME "$ENV_FILE" | cut -d '=' -f 2)

if [ -z "$DB_USER" ] || [ -z "$DB_NAME" ]; then
    echo "ERROR: Could not read DB_USER or DB_NAME from ${ENV_FILE}." >&2
    exit 1
fi

echo "Connecting to database '${DB_NAME}' as user '${DB_USER}'..."

# Execute the psql command using the variables we just loaded.
# The -T flag is best for non-interactive execution.
if ! sudo docker compose exec -T db psql -U "${DB_USER}" -d "${DB_NAME}" -c "SELECT email, role, status FROM users WHERE email = 'jason.archibald@archis-marine.online';"; then
    echo
    echo "VERIFICATION FAILED: The psql command failed to execute. Check the error above." >&2
    exit 1
fi

echo "--- Verification command executed successfully. Review output above. ---"
