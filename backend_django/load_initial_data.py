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

# Crear un partido de prueba
PartidoPolitico.objects.create(
    lider="Candidato de Prueba",
    candidato="Candidato de Prueba",
    anio_fundacion=2024,
    pill_color="#FF0000",
    logo="https://via.placeholder.com/150",
    vector_ideologico="[0.0, 0.0]",
    descripcion_corta="Partido de prueba para verificar deployment"
)

print("✓ Datos iniciales cargados exitosamente")
