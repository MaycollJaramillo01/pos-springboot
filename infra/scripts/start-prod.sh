#!/bin/bash
#export ENVIRONMENT=production
#export SPRING_PROFILE=production
#export SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/mydatabase

#docker compose -f ./../docker-compose.prod.yml up -d
#echo "Todos los servicios corriendo en producción"

#!/bin/bash

echo "=========================================="
echo "Building and starting all services..."
echo "Using JDK 21.0.8"
echo "Project structure with infra folder"
echo "=========================================="

# Stop existing containers
docker-compose down

# Build and start
docker compose -f ./../docker-compose.prod.yml up --build -d

echo "=========================================="
echo "Services are starting..."
echo "Postgres: localhost:5432"
echo "Spring Boot API: localhost:8080"
echo "Nginx Proxy: localhost:80"
echo "=========================================="

# Show logs
echo "Showing logs... (Ctrl+C to exit)"
docker-compose logs -f
