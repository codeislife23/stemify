# Docker Setup for Stemify

This document provides detailed instructions for running the Stemify application using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your system
- [Docker Compose](https://docs.docker.com/compose/install/) installed on your system

## Overview

The Stemify application is containerized using Docker, with separate containers for:

1. **Frontend**: React application served by a lightweight Node.js server
2. **Backend**: Flask API for audio processing

## Docker Files

The project includes the following Docker-related files:

- `docker-compose.yml`: Orchestrates both frontend and backend services
- `Dockerfile.frontend`: Builds the frontend container
- `backend/Dockerfile`: Builds the backend container

## Running with Docker Compose

The simplest way to run the entire application is using Docker Compose:

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

After starting the services, the application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Building and Running Individual Containers

If you prefer to build and run containers individually:

### Backend Container

```bash
# Navigate to the backend directory
cd backend

# Build the backend image
docker build -t stemify-backend .

# Run the backend container
docker run -p 5000:5000 -v $(pwd)/uploads:/app/uploads -v $(pwd)/outputs:/app/outputs stemify-backend
```

### Frontend Container

```bash
# Build the frontend image
docker build -t stemify-frontend -f Dockerfile.frontend .

# Run the frontend container
docker run -p 3000:3000 -e VITE_API_URL=http://localhost:5000/api stemify-frontend
```

## Environment Variables

### Frontend Environment Variables

- `VITE_API_URL`: URL of the backend API (default: http://localhost:5000/api)

### Backend Environment Variables

- `PORT`: Port to run the Flask server on (default: 5000)

## Volume Mounts

The Docker Compose configuration includes volume mounts for persistent data:

- `./backend/uploads:/app/uploads`: Stores uploaded audio files
- `./backend/outputs:/app/outputs`: Stores separated stem files

## Development with Docker

For development purposes, you can modify the Docker Compose configuration to enable hot-reloading:

```yaml
# Example development docker-compose.override.yml
version: '3.8'

services:
  frontend:
    volumes:
      - ./src:/app/src
    command: npm run dev
    environment:
      - NODE_ENV=development

  backend:
    volumes:
      - ./backend:/app
    environment:
      - FLASK_ENV=development
      - FLASK_DEBUG=1
```

## Troubleshooting Docker Issues

### Common Issues

1. **Port conflicts**:
   - If ports 3000 or 5000 are already in use, modify the port mappings in docker-compose.yml

2. **Permission issues with volumes**:
   - Ensure the host directories for volumes exist and have appropriate permissions

3. **Network issues between containers**:
   - In the frontend container, use the service name to access the backend: http://backend:5000/api

4. **Container not starting**:
   - Check logs with `docker-compose logs <service_name>`
   - Ensure all required environment variables are set

## Production Deployment

For production deployment:

1. Build optimized images:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
   ```

2. Consider using a reverse proxy (like Nginx) for SSL termination and routing

3. Use Docker secrets or environment files for sensitive configuration

4. Set appropriate resource limits for containers

## Docker Compose Reference

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://localhost:5000/api

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/outputs:/app/outputs
``` 