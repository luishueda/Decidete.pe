from django.contrib import admin
from .models import Usuario, PartidoPolitico, Pregunta, Respuesta, HistorialMatch

# Esto hace que tus tablas aparezcan en el panel
admin.site.register(Usuario)
admin.site.register(PartidoPolitico)
admin.site.register(Pregunta)
admin.site.register(Respuesta)
admin.site.register(HistorialMatch)