import os
import django
import sys

# Configurar entorno Django
sys.path.append(r'c:\Users\diesi\Desktop\Proyecto Dedicete\decide-pe-angular\backend_django')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api_quiz.models import PartidoPolitico

try:
    print("Conectando a DB...")
    partido = PartidoPolitico.objects.first()
    if partido:
        print(f"EXITO: Partido encontrado: ID={partido.id_partidopolitico}")
        # Intentar acceder a atributos para ver cuál existe
        try:
            print(f"nombre_partido: {partido.nombre_partido}")
        except AttributeError:
            print("nombre_partido: NO EXISTE")
            
        try:
            print(f"candidato: {partido.candidato}")
        except AttributeError:
            print("candidato: NO EXISTE")
            
    else:
        print("EXITO: Conexión OK, pero tabla vacía.")
except Exception as e:
    print(f"ERROR FATAL: {str(e)}")
