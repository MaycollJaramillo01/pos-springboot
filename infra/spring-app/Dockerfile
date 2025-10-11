# Build stage with Maven and JDK 21
FROM maven:3.9.8-eclipse-temurin-21 AS builder
WORKDIR /app

# Copy pom.xml and download dependencies (cache layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the application
COPY ../../src ./src
RUN mvn clean package -DskipTests

# Runtime stage with JDK 21
FROM eclipse-temurin:21.0.8_7-jdk-jammy
WORKDIR /app

# Install wait-for-it for database readiness
RUN apt-get update && apt-get install -y wait-for-it curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy the built JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Create a non-root user for security
RUN groupadd -r spring && useradd -r -g spring spring
USER spring

EXPOSE 8080

ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "wait-for-it postgres:5432 --timeout=60 -- java $JAVA_OPTS -jar app.jar"]
