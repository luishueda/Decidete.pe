#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

# Cargar datos iniciales solo si la base de datos está vacía
python manage.py loaddata datos_iniciales.json --ignorenonexistent || true
