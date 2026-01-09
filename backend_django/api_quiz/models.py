from django.db import models

# Modelo que reflejan las tablas en el Postgres
class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100, null=True, blank=True)
    email = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=255)

    class Meta:
        db_table = 'usuarios'
        app_label = 'api_quiz'


class PartidoPolitico(models.Model):
    id_partidopolitico = models.AutoField(primary_key=True)
    lider = models.CharField(max_length=150, null=True, blank=True)
    candidato = models.CharField(max_length=150, null=True, blank=True)
    anio_fundacion = models.IntegerField(null=True, blank=True)
    pill_color = models.CharField(max_length=50, null=True, blank=True)
    logo = models.CharField(max_length=255, null=True, blank=True)
    vector_ideologico = models.TextField(null=True, blank=True)
    financiamiento = models.CharField(max_length=255, null=True, blank=True)
    representacion_actual = models.CharField(max_length=255, null=True, blank=True)
    descripcion_corta = models.TextField(null=True, blank=True)
    historia_breve = models.TextField(null=True, blank=True)
    propuestas_clave = models.TextField(null=True, blank=True)
    sentencias = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'partidospoliticos' 
        app_label = 'api_quiz'


class Pregunta(models.Model):
    id_pregunta = models.AutoField(primary_key=True)
    enunciadopregunta = models.TextField()
    peso_impacto = models.FloatField()
    vector_influencia = models.TextField(null=True, blank=True)
    temacategoria = models.CharField(max_length=100, null=True, blank=True)
    subcategoria = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'preguntas'
        app_label = 'api_quiz'


class Respuesta(models.Model):
    id_respuesta = models.AutoField(primary_key=True)
    fk_id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='fk_id_usuario')
    fk_id_pregunta = models.ForeignKey(Pregunta, on_delete=models.CASCADE, db_column='fk_id_pregunta')
    valor_seleccionado = models.IntegerField(null=True, blank=True)
    vector_resultante = models.TextField(null=True, blank=True)
    fk_id_partidopolitico = models.ForeignKey(PartidoPolitico, on_delete=models.SET_NULL, null=True, blank=True, db_column='fk_id_partidopolitico')

    class Meta:
        db_table = 'respuestas'
        app_label = 'api_quiz'
        unique_together = ('fk_id_usuario', 'fk_id_pregunta')


class HistorialMatch(models.Model):
    id_historial = models.AutoField(primary_key=True)
    fk_id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column='fk_id_usuario')
    fk_id_partidopolitico = models.ForeignKey(PartidoPolitico, on_delete=models.CASCADE, db_column='fk_id_partidopolitico')
    similitud_pct = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = 'historial_match'
        app_label = 'api_quiz'
        unique_together = ('fk_id_usuario', 'fk_id_partidopolitico')