#!/bin/bash
export ENVIRONMENT=development
export SPRING_PROFILE=development
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/mydatabase

docker-compose -f ./../docker-compose.dev.yml up -d
echo "Postgres corriendo en localhost:5432"
echo "Ejecuta tu Spring Boot localmente conectado a esta DB"
