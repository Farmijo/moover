#!/bin/bash
set -e

# Espera a que Postgres esté listo
until PGPASSWORD=password psql -h "db" -U "moover" -d "moover_development" -c '\q'; do
  echo "Postgres está inaccesible — esperando..."
  sleep 1
done

# Crea y migra la base de datos
echo "Aplicando migraciones..."
bundle exec rails db:prepare

exec "$@"
