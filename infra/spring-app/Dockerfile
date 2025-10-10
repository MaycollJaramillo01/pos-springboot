# Usar imagen base de Java
FROM openjdk:21-jdk-slim

# Directorio de trabajo
WORKDIR /app

# Copiar el JAR de la aplicación
COPY target/*.jar app.jar

# Exponer puerto
EXPOSE 8080

# Variables de entorno para la JVM
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Comando para ejecutar la aplicación
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
