FROM nginx:alpine

# Copiar configuración personalizada
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puertos
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
