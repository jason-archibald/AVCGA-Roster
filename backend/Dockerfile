# Use an official Node.js LTS image based on Alpine Linux for a small base image.
FROM node:20-alpine
WORKDIR /usr/src/app
# Copy package manifests first to leverage Docker layer caching.
COPY package*.json ./
# Install only production dependencies to keep the final image lean.
RUN npm install --only=production
# Copy the rest of the application source code.
COPY . .
# Document the port the app runs on.
EXPOSE 3000
# Define the command to run the application.
CMD [ "node", "server.js" ]
