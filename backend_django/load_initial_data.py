#!/usr/bin/env python
"""
Script para cargar datos iniciales en Render
Se ejecuta automáticamente en el build
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api_quiz.models import PartidoPolitico

# Verificar si ya hay datos
if PartidoPolitico.objects.exists():
    print("✓ Los datos ya existen, saltando carga inicial")
    exit(0)

print("→ Cargando datos iniciales...")

# Aquí cargaremos los datos manualmente
# Por ahora, solo creamos un partido de prueba para verificar que funciona
PartidoPolitico.objects.create(
    nombre_partido="Partido de Prueba",
    lider_candidato="Candidato de Prueba",
    ideologia="Centro",
    posicion_economica=0.0,
    posicion_social=0.0,
    logo_url="https://via.placeholder.com/150",
    color_partido="#FF0000",
    descripcion="Partido de prueba para verificar deployment"
)

print("✓ Datos iniciales cargados exitosamente")
