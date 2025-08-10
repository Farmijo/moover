FROM node:20-alpine

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache libc6-compat

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Instalar todas las dependencias (dev + production para desarrollo)
RUN npm ci

# Copiar código fuente
COPY . .

# Exponer el puerto
EXPOSE 3001

# Comando para desarrollo (hot reload)
CMD ["npm", "run", "dev", "--", "--port", "3001"]
