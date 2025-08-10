# Moover - Full Stack Docker Setup

Este docker-compose ejecuta todos los servicios de la aplicación Moover: backend (Rails), frontend (Next.js) y base de datos (PostgreSQL).

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker y Docker Compose instalados
- Puerto 3000, 3001 y 5432 disponibles

### Ejecutar todos los servicios

```bash
# En el directorio raíz del proyecto
docker-compose up

# Para ejecutar en segundo plano
docker-compose up -d

# Para ver los logs
docker-compose logs -f

# Para ver logs de un servicio específico
docker-compose logs -f api      # Backend
docker-compose logs -f frontend # Frontend
docker-compose logs -f db       # Base de datos
```

### Parar los servicios

```bash
# Parar todos los servicios
docker-compose down

# Parar y eliminar volúmenes (CUIDADO: elimina la base de datos)
docker-compose down -v
```

## 📋 Servicios Disponibles

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:3001 | Aplicación Next.js (React) |
| **Backend API** | http://localhost:3000 | API Rails con autenticación JWT |
| **Base de datos** | localhost:5432 | PostgreSQL (interno) |

## 🔧 Configuración

### Variables de Entorno

El docker-compose incluye las variables de entorno necesarias:

- `DATABASE_URL`: Conexión a PostgreSQL
- `RAILS_MASTER_KEY`: Clave para credenciales Rails
- `JWT_SECRET_KEY`: Clave para tokens JWT
- `NEXT_PUBLIC_API_BASE_URL`: URL del backend para el frontend

### Health Checks

Los servicios incluyen health checks para asegurar que estén funcionando:

- **DB**: Verifica que PostgreSQL esté respondiendo
- **API**: Verifica que Rails esté respondiendo en `/up`
- **Frontend**: Se inicia después de que el API esté listo

## 🛠️ Comandos Útiles

### Ejecutar comandos en los contenedores

```bash
# Acceder al contenedor del backend
docker-compose exec api bash

# Ejecutar migraciones
docker-compose exec api bundle exec rails db:migrate

# Ejecutar seeds
docker-compose exec api bundle exec rails db:seed

# Acceder al contenedor del frontend
docker-compose exec frontend sh

# Instalar nuevas dependencias (frontend)
docker-compose exec frontend npm install <paquete>

# Acceder a la base de datos
docker-compose exec db psql -U moover -d moover_development
```

### Rebuilding servicios

```bash
# Rebuild todos los servicios
docker-compose build

# Rebuild un servicio específico
docker-compose build api
docker-compose build frontend

# Rebuild y reiniciar
docker-compose up --build
```

### Datos de la base de datos

```bash
# Backup de la base de datos
docker-compose exec db pg_dump -U moover moover_development > backup.sql

# Restaurar backup
docker-compose exec db psql -U moover -d moover_development < backup.sql
```

## 🔍 Debugging

### Ver logs de un servicio específico

```bash
docker-compose logs -f api      # Backend Rails
docker-compose logs -f frontend # Frontend Next.js
docker-compose logs -f db       # PostgreSQL
```

### Problemas comunes

1. **Puerto ocupado**: Si algún puerto está ocupado, detén el servicio que lo usa:
   ```bash
   sudo lsof -i :3000  # Ver qué usa el puerto 3000
   sudo lsof -i :3001  # Ver qué usa el puerto 3001
   ```

2. **Base de datos no conecta**: Verifica que el contenedor de PostgreSQL esté corriendo:
   ```bash
   docker-compose ps
   ```

3. **Cambios no se reflejan**: Para desarrollo con hot reload, los volúmenes están montados, pero si hay problemas:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

## 📁 Estructura del Proyecto

```
moover/
├── docker-compose.yml          # Configuración de todos los servicios
├── moover-api/                 # Backend Rails
│   ├── Dockerfile
│   └── ...
├── moover-frontend/            # Frontend Next.js
│   ├── Dockerfile
│   └── ...
└── README.md                   # Este archivo
```

## 🎯 URLs de Desarrollo

- **Aplicación**: http://localhost:3001
- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/up (health check)

¡Ahora puedes desarrollar con todos los servicios ejecutándose juntos! 🚀
