#!/bin/bash
set -e; if [[ $EUID -ne 0 ]]; then echo "ERROR: Run as root." >&2; exit 1; fi
echo "--- Starting Host Environment Setup (Debian 12) ---"
echo "--> Updating packages and installing essentials..."
apt-get update && apt-get upgrade -y
apt-get install -y curl wget git gnupg2 ca-certificates build-essential ufw
echo "--> Installing Node.js (LTS)..."
NODE_MAJOR=20; mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list > /dev/null
apt-get update && apt-get install -y nodejs
echo "--> Installing Docker and Docker Compose..."
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=\"$(dpkg --print-architecture)\" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \"$(. /etc/os-release && echo "$VERSION_CODENAME")\" stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update && apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
if [ -n "$SUDO_USER" ] && [ "$SUDO_USER" != "root" ]; then usermod -aG docker "$SUDO_USER"; fi
echo "--> Installing Nginx and Certbot..."
apt-get install -y nginx certbot python3-certbot-nginx
systemctl enable nginx && systemctl start nginx
echo "--> Configuring Firewall..."
ufw allow 22/tcp; ufw allow 80/tcp; ufw allow 443/tcp; ufw --force enable
echo "--- Host Setup Complete. IMPORTANT: Log out and log back in to apply Docker permissions. ---"
