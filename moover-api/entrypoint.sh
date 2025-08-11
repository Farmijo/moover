#!/bin/bash
set -e


# Crea y migra la base de datos
echo "Aplicando migraciones..."
bundle exec rails db:prepare

exec "$@"
