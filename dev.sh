#!/bin/bash

# Moover Development Environment Manager
# Este script facilita el manejo del entorno de desarrollo con Docker

case "$1" in
  start)
    echo "🚀 Iniciando todos los servicios de Moover..."
    docker-compose up
    ;;
  start-bg)
    echo "🚀 Iniciando todos los servicios de Moover en segundo plano..."
    docker-compose up -d
    ;;
  stop)
    echo "🛑 Deteniendo todos los servicios..."
    docker-compose down
    ;;
  restart)
    echo "🔄 Reiniciando todos los servicios..."
    docker-compose down
    docker-compose up -d
    ;;
  rebuild)
    echo "🔨 Reconstruyendo y reiniciando servicios..."
    docker-compose down
    docker-compose build
    docker-compose up -d
    ;;
  logs)
    if [ -z "$2" ]; then
      echo "📋 Mostrando logs de todos los servicios..."
      docker-compose logs -f
    else
      echo "📋 Mostrando logs de $2..."
      docker-compose logs -f $2
    fi
    ;;
  status)
    echo "📊 Estado de los servicios:"
    docker-compose ps
    ;;
  shell-api)
    echo "🐚 Accediendo al contenedor del API..."
    docker-compose exec api bash
    ;;
  shell-frontend)
    echo "🐚 Accediendo al contenedor del frontend..."
    docker-compose exec frontend sh
    ;;
  db-shell)
    echo "🐚 Accediendo a la base de datos..."
    docker-compose exec db psql -U moover -d moover_development
    ;;
  db-migrate)
    echo "🗂️  Ejecutando migraciones..."
    docker-compose exec api bundle exec rails db:migrate
    ;;
  db-seed)
    echo "🌱 Ejecutando seeds..."
    docker-compose exec api bundle exec rails db:seed
    ;;
  db-reset)
    echo "⚠️  Reseteando base de datos..."
    echo "¿Estás seguro? Esto eliminará todos los datos. (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
      docker-compose exec api bundle exec rails db:drop db:create db:migrate db:seed
    else
      echo "Operación cancelada."
    fi
    ;;
  clean)
    echo "🧹 Limpiando contenedores, imágenes y volúmenes no utilizados..."
    docker-compose down -v
    docker system prune -f
    ;;
  *)
    echo "Moover Development Environment Manager"
    echo ""
    echo "Uso: ./dev.sh [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  start         Iniciar todos los servicios"
    echo "  start-bg      Iniciar en segundo plano"
    echo "  stop          Detener todos los servicios"
    echo "  restart       Reiniciar todos los servicios"
    echo "  rebuild       Reconstruir y reiniciar servicios"
    echo "  logs [servicio] Mostrar logs (api|frontend|db)"
    echo "  status        Ver estado de los servicios"
    echo "  shell-api     Acceder al contenedor del API"
    echo "  shell-frontend Acceder al contenedor del frontend"
    echo "  db-shell      Acceder a la base de datos"
    echo "  db-migrate    Ejecutar migraciones"
    echo "  db-seed       Ejecutar seeds"
    echo "  db-reset      Resetear base de datos (⚠️ elimina datos)"
    echo "  clean         Limpiar contenedores y volúmenes"
    echo ""
    echo "Ejemplos:"
    echo "  ./dev.sh start          # Iniciar todos los servicios"
    echo "  ./dev.sh logs api       # Ver logs del API"
    echo "  ./dev.sh db-migrate     # Ejecutar migraciones"
    echo ""
    echo "URLs de desarrollo:"
    echo "  Frontend: http://localhost:3001"
    echo "  API:      http://localhost:3000"
    ;;
esac
