from rest_framework import serializers
from .models import PartidoPolitico, Pregunta, Usuario, HistorialMatch

# Serializador para el resumen que va al Frontend
class PartidoResumenSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartidoPolitico
        fields = ['id_partidopolitico', 'lider', 'candidato', 'pill_color', 'logo']

# Serializador para las preguntas
class PreguntaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pregunta
        fields = ['id_pregunta', 'enunciadopregunta', 'peso_impacto', 'vector_influencia', 'temacategoria']

# Serializer para cargar/ver TODOS los datos del partido
class PartidoPoliticoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartidoPolitico
        fields = '__all__'

# Serializer de Usuario
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

# Serializer para el historial
class HistorialAdminSerializer(serializers.ModelSerializer):
    nombre_usuario = serializers.CharField(source='fk_id_usuario.nombre', read_only=True)
    nombre_partido = serializers.CharField(source='fk_id_partidopolitico.candidato', read_only=True)

    class Meta:
        model = HistorialMatch
        fields = ['id_historial', 'nombre_usuario', 'nombre_partido', 'similitud_pct']