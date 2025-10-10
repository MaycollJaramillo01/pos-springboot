#!/bin/bash
export ENVIRONMENT=production
export SPRING_PROFILE=production
export SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/mydatabase

docker compose -f ./../docker-compose.prod.yml up -d
echo "Todos los servicios corriendo en producción"
