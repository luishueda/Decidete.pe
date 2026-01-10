#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

# Crear superusuario si no existe
python manage.py create_superuser || true

# Cargar datos iniciales con script Python
python load_initial_data.py || true
