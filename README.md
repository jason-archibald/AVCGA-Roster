# AVCGA CrewHub: Operational Scheduling & Management System

AVCGA CrewHub is a comprehensive, multi-service application designed to manage the complex scheduling, asset tracking, member management, and communication needs of the Australian Volunteer Coast Guard Association (AVCGA).

This system provides a robust, scalable, and secure foundation for flotilla and squadron operations, featuring dedicated web portals for both general members and administrators.

---

## Table of Contents

1.  [Core Features](#core-features)
2.  [System Architecture](#system-architecture)
3.  [Deployment from Scratch](#deployment-from-scratch)
4.  [Application Management](#application-management)
5.  [Troubleshooting](#troubleshooting)
6.  [Project Structure](#project-structure)

---

## Core Features

### Member Portal (`/`)
-   **Dashboard:** A personalized landing page for members.
-   **Calendar:** View upcoming duty rosters and events.
-   **Profile Management:** (Future) View and update personal details and qualifications.

### Admin Portal (`/admin/`)
-   **Dashboard:** An overview of system status.
-   **Member Management:** Full CRUD (Create, Read, Update, Delete) capabilities for all members.
-   **Organization Management:** Full CRUD capabilities for Squadrons and Flotillas.
-   **Asset Management:** View, add, and edit Vessels and Vehicles.
-   **Roster Management:** Create and manage duty rosters and assign members to shifts.

---

## System Architecture

The application is built on a modern, containerized, multi-service architecture to ensure scalability, portability, and separation of concerns.

-   **Containerization:** The entire application stack is orchestrated using **Docker** and **Docker Compose**. Each part of the application runs in its own isolated container.
-   **Backend Service (`backend`):** A **Node.js** server using the **Express.js** framework. It provides a RESTful API for all application data and logic.
-   **Database Service (`db`):** A **PostgreSQL 15** database container. All application data is stored here in a relational schema.
-   **Member Portal (`member-web`):** A modern Single Page Application (SPA) built with **React.js** and **Vite**. It is served by a lightweight **Nginx** container.
-   **Admin Portal (`web-admin`):** A separate React.js and Vite SPA, also served by its own Nginx container. It provides the administrative interface.
-   **Reverse Proxy (Host Nginx):** A main Nginx service running on the host machine acts as a reverse proxy. It receives all incoming web traffic on ports 80/443 and intelligently routes requests to the appropriate container (`member-web`, `web-admin`, or `backend`) based on the URL path.

 <!-- Placeholder for a future diagram -->

---

## Deployment from Scratch

This guide details the complete process for deploying the application on a fresh **Debian 12** server.

### **Step 1: Prepare the Host Server**

This step installs all system-level dependencies required to run the application.

1.  Log into your fresh Debian 12 server.
2.  Place the project files in `/opt/AVCGA-CrewHub`. You can do this via `git clone` or by running the `create-complete-project.sh` script.
3.  Navigate to the project directory:
    ```bash
    cd /opt/AVCGA-CrewHub
    ```
4.  Run the host setup script. This will install Docker, Nginx, Node.js, and configure the firewall.
    ```bash
    sudo ./scripts/setup-host.sh
    ```
5.  **CRITICAL:** Log out of your SSH session and log back in. This is required to apply the Docker group permissions to your user account.

### **Step 2: Initialize the Application**

This step performs a full, clean initialization of the application. It will create the database, build all Docker images, and start the services.

1.  Navigate to the project directory:
    ```bash
    cd /opt/AVCGA-CrewHub
    ```
2.  If you need to wipe all existing data and start completely fresh, use the reset script. **This is the recommended command for the very first launch.**
    ```bash
    sudo ./scripts/reset-db.sh
    ```
    -   When prompted, type `YES` to confirm the data wipe.
    -   This script automatically calls `project-init.sh` at the end.

### **Step 3: Activate the Nginx Reverse Proxy**

This is the final step that makes your application accessible from the internet.

1.  Navigate to the project directory:
    ```bash
    cd /opt/AVCGA-CrewHub
    ```
2.  Run the Nginx activation script. This copies the project's configuration to the live Nginx service and reloads it.
    ```bash
    sudo ./scripts/activate-nginx.sh
    ```

**Deployment is now complete.** You can access the application at your server's IP address:
-   **Member Portal:** `http://<your-server-ip>/`
-   **Admin Portal:** `http://<your-server-ip>/admin/`
-   **Default Login:** `jason.archibald@archis-marine.online` / `Password123`

---

## Application Management

Use these scripts for day-to-day operations and updates.

### **Starting and Stopping the System**
-   **To start all services** (Docker stack + host Nginx):
    ```bash
    sudo ./start.sh
    ```
-   **To stop all services:**
    ```bash
    sudo ./stop.sh
    ```

### **Deploying Code Updates**
When you have new source code (e.g., from a `git pull` or a patch):

1.  Run the project initialization script. It will stop the old containers, rebuild the images with your new code, and restart them without destroying your data.
    ```bash
    sudo ./scripts/project-init.sh
    ```

### **Backing Up and Restoring**
-   **To create a full backup** (database dump + application files):
    ```bash
    sudo ./maintenance/backup.sh
    ```
    Backups are stored in the `backups/` directory.
-   **To restore from a backup** (this is a destructive operation):
    ```bash
    sudo ./maintenance/restore.sh backups/<your-backup-file.tar.gz>
    ```

---

## Troubleshooting

If the application is not accessible, follow these diagnostic steps in order.

1.  **Check Docker Container Status:**
    ```bash
    sudo docker compose ps
    ```
    -   Ensure all services (`db`, `backend`, `member-web`, `web-admin`) show a status of `Up` or `running`. The `db` container should be `(healthy)`.
    -   If a container is `Exited` or `Restarting`, check its specific logs: `sudo docker compose logs <service_name>`.

2.  **Verify the Database:**
    -   Run the verification script to confirm the admin user exists:
        ```bash
        sudo ./scripts/verify-db-user.sh
        ```
    -   If the user is missing, it means the database initialization failed. Perform a full reset with `sudo ./scripts/reset-db.sh`.

3.  **Check Host Nginx Status:**
    ```bash
    sudo systemctl status nginx
    sudo nginx -t
    ```
    -   Ensure the service is `active (running)` and that the syntax test is successful. If not, your `/etc/nginx/sites-enabled/crew-hub.conf` may have an error. Re-run `sudo ./activate-nginx.sh` to fix it.

4.  **Check Firewall:**
    ```bash
    sudo ufw status
    ```
    -   Ensure that port 80 and/or 443 are allowed. Also check your cloud provider's firewall (e.g., AWS Security Group).

5.  **Clear Browser Cache:**
    -   A "blank page" or login error after a deployment is often caused by a stale browser cache. Do a hard refresh (`Ctrl+Shift+R` or `Cmd+Shift+R`) or use a private/incognito window to test.

---

## Project Structure
A high-level overview of the project's directory structure.
\`\`\`
/opt/AVCGA-CrewHub/
├── backend/                # Node.js API Service
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── sql/                # Database schema and seed files
├── member-web/             # React Member Portal
│   ├── public/
│   └── src/
├── web-admin/              # React Admin Portal
│   ├── public/
│   └── src/
├── scripts/                # Core operational scripts
│   ├── activate-nginx.sh
│   ├── build-frontends.sh
│   ├── project-init.sh
│   ├── reset-db.sh
│   ├── setup-host.sh
│   └── verify-db-user.sh
├── maintenance/            # Backup and restore utilities
│   ├── backup.sh
│   └── restore.sh
├── backups/                # (Generated) Stores backup archives
├── docker-compose.yml      # Main Docker Compose orchestration file
├── nginx-sample.conf       # Template for the host's reverse proxy config
└── README.md               # This file
\`\`\`

