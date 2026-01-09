from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from django.db import IntegrityError
import json
from rest_framework.views import APIView   
from rest_framework import status         
import math
from rest_framework.parsers import MultiPartParser, FormParser
import pandas as pd 
from .models import Pregunta, PartidoPolitico, Respuesta, HistorialMatch, Usuario
from .serializers import (
    PartidoResumenSerializer, 
    PreguntaSerializer, 
    PartidoPoliticoSerializer, 
    UsuarioSerializer, 
    HistorialAdminSerializer
)

D_MAX_NORMALIZED = 28.28

# --- 1. ENDPOINT: RESUMEN DE PARTIDOS (GET) ---
@api_view(['GET'])
def partidos_resumen_list(request):
    try:
        partidos = PartidoPolitico.objects.all()
        serializer = PartidoResumenSerializer(partidos, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': 'Fallo al obtener partidos: ' + str(e)}, status=500)

# --- 2. ENDPOINT: LISTA DE PREGUNTAS (GET) ---
# --- 2. ENDPOINT: LISTA DE PREGUNTAS (CON FILTRO) ---
# --- 2. ENDPOINT: LISTA DE PREGUNTAS (SIMPLE - SIN FILTROS) ---
@api_view(['GET']) 
def preguntas_list(request):
    try:
        # Traemos TODAS las preguntas ordenadas por ID
        preguntas = Pregunta.objects.all().order_by('id_pregunta')
        
        serializer = PreguntaSerializer(preguntas, many=True)
        return Response(serializer.data)
    except Exception as e:
        # Esto imprimirá el error real en tu consola negra para que sepas qué pasó
        print(f"🔥 ERROR EN PREGUNTAS: {str(e)}") 
        return Response({'error': 'Fallo al obtener la lista de preguntas: ' + str(e)}, status=500)

# --- 3. ENDPOINT: CALCULAR AFINIDAD (POST) ---
@api_view(['POST']) 
def calcular_quiz_match(request):
    try:
        respuestas_json = request.data.get('respuestas')
        usuario_id_raw = request.data.get('usuario_id') 
        
        usuario_obj = None
        if usuario_id_raw:
            try:
                usuario_obj = Usuario.objects.get(id_usuario=usuario_id_raw)
            except Usuario.DoesNotExist:
                pass

        vpu_economico = 0.0
        vpu_social = 0.0
        
        for resp in respuestas_json:
            pregunta_id = resp.get('pregunta_id')
            valor_usuario = int(resp.get('respuesta'))
            
            try:
                pregunta = Pregunta.objects.get(id_pregunta=pregunta_id)
                vector_config = json.loads(pregunta.vector_influencia) 
                
                valor_normalizado = valor_usuario - 3 
                impacto_eco = valor_normalizado * pregunta.peso_impacto * vector_config[0]
                impacto_soc = valor_normalizado * pregunta.peso_impacto * vector_config[1]
                
                vpu_economico += impacto_eco
                vpu_social += impacto_soc

                if usuario_obj:
                    try:
                        Respuesta.objects.create(
                            fk_id_usuario=usuario_obj,
                            fk_id_pregunta=pregunta,
                            valor_seleccionado=valor_usuario,
                            vector_resultante=json.dumps([impacto_eco, impacto_soc]) 
                        )
                    except Exception:
                        pass

            except Pregunta.DoesNotExist:
                continue
        
        vpu_final = [vpu_economico, vpu_social]
        resultados_match = []
        
        for partido in PartidoPolitico.objects.all():
            if not partido.vector_ideologico:
                continue
            vector_partido = json.loads(partido.vector_ideologico)
            d_eco = vpu_final[0] - vector_partido[0]
            d_soc = vpu_final[1] - vector_partido[1]
            distancia = math.sqrt((d_eco ** 2) + (d_soc ** 2))
            similitud_pct = 100 * (1 - (distancia / D_MAX_NORMALIZED))
            resultados_match.append({
                'partido': partido,
                'similitud_pct': round(max(0, similitud_pct), 2),
            })

        if not resultados_match:
            return Response({'error': 'No se pudieron comparar partidos'}, status=500)

        resultados_match.sort(key=lambda x: x['similitud_pct'], reverse=True)
        partido_mas_afin = resultados_match[0]['partido']
        similitud_final = resultados_match[0]['similitud_pct']
        
        if usuario_obj:
            try:
                HistorialMatch.objects.create(
                    fk_id_usuario=usuario_obj,
                    fk_id_partidopolitico=partido_mas_afin,
                    similitud_pct=similitud_final
                )
            except IntegrityError:
                pass 

        return Response({
            'vpu_final': [round(vpu_final[0], 2), round(vpu_final[1], 2)],
            'partido_vector': json.loads(partido_mas_afin.vector_ideologico),
            'partido_mas_afin': partido_mas_afin.candidato or "Candidato por definir",
            'similitud_final': similitud_final,
            'partidos_ordenados': [
                {'candidato': r['partido'].candidato or "Por definir", 'similitud': r['similitud_pct']}
                for r in resultados_match
            ]
        }, status=201)
    except Exception as e:
        return Response({'error_proceso': 'Error en el cálculo: ' + str(e)}, status=400)

# --- 4. ENDPOINT: REGISTRO DE USUARIO (POST) ---
@api_view(['POST'])
def registrar_usuario(request):
    try:
        data = request.data
        if Usuario.objects.filter(email=data['email']).exists():
            return Response({'error': 'El correo ya está registrado.'}, status=400)

        nuevo_usuario = Usuario.objects.create(
            nombre=data['nombre'],
            apellidos=data.get('apellidos', ''),
            email=data['email'],
            password=make_password(data['password']) 
        )
        
        return Response({
            'mensaje': 'Registro exitoso',
            'id_usuario': nuevo_usuario.id_usuario,
            'nombre': nuevo_usuario.nombre
        }, status=201)
    except Exception as e:
        return Response({'error': 'Error al registrar: ' + str(e)}, status=500)

# --- 5. ENDPOINT: INICIAR SESIÓN (POST) ---
@api_view(['POST'])
def login_usuario(request):
    try:
        data = request.data
        email_recibido = data.get('email')
        password_recibido = data.get('password')
        
        usuario = Usuario.objects.get(email=email_recibido)
        
        if check_password(password_recibido, usuario.password):
            return Response({
                'mensaje': 'Login correcto',
                'id_usuario': usuario.id_usuario,
                'nombre': usuario.nombre,
                'email': usuario.email
            }, status=200)
        else:
            return Response({'error': 'Contraseña incorrecta'}, status=401)
            
    except Usuario.DoesNotExist:
        return Response({'error': 'El correo no está registrado'}, status=404)
    except Exception as e:
        return Response({'error': 'Error de servidor: ' + str(e)}, status=500)

# --- 6. ENDPOINT: OBTENER HISTORIAL DE USUARIO (POST) ---
@api_view(['POST'])
def historial_usuario(request):
    try:
        usuario_id = request.data.get('usuario_id')
        matches = HistorialMatch.objects.filter(fk_id_usuario_id=usuario_id).select_related('fk_id_partidopolitico').order_by('-id_historial')
        
        data = []
        for match in matches:
            data.append({
                'id': match.id_historial,
                'partido': match.fk_id_partidopolitico.candidato, 
                'color': match.fk_id_partidopolitico.pill_color, 
                'porcentaje': match.similitud_pct,
            })
            
        return Response(data, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# --- 7. ENDPOINT: COMPARAR PARTIDOS Y VER DETALLE (POST) ---
@api_view(['POST'])
def comparar_partidos(request):
    try:
        ids = request.data.get('ids', [])
        partidos = PartidoPolitico.objects.filter(id_partidopolitico__in=ids)
        data = {}
        for p in partidos:
            vec = json.loads(p.vector_ideologico) if p.vector_ideologico else [0,0]
            tendencia = "Derecha" if vec[0] > 2 else "Izquierda" if vec[0] < -2 else "Centro"
            
            data[p.candidato] = {
                "logo": p.logo,
                "Nombre del partido": p.candidato,
                "lider": p.lider,
                "Fecha de inscripción": str(p.anio_fundacion),
                "Tendencia política": tendencia,
                "Representación actual": p.representacion_actual or "No disponible",
                "Financiamiento": p.financiamiento or "No disponible",
                "color": p.pill_color, 
                "descripcion_corta": getattr(p, 'descripcion_corta', ''),
                "historia_breve": getattr(p, 'historia_breve', ''),
                "propuestas_clave": getattr(p, 'propuestas_clave', ''),
                "sentencias": getattr(p, 'sentencias', '')
            }
        return Response(data, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# --- 8. CARGA MASIVA DE PREGUNTAS ---
class CargaMasivaPreguntasView(APIView):
    def post(self, request):
        serializer = PreguntaSerializer(data=request.data, many=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                "mensaje": "¡Carga masiva exitosa!", 
                "total_registros": len(serializer.data)
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- 9. CARGA MASIVA DE PARTIDOS ---
class CargaMasivaPartidosView(APIView):
    def post(self, request):
        serializer = PartidoPoliticoSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "mensaje": "¡Partidos cargados correctamente!", 
                "total_registros": len(serializer.data)
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- 10. ADMIN: LISTAR USUARIOS ---
class AdminUsuarioListView(APIView):
    def get(self, request):
        usuarios = Usuario.objects.all().order_by('-id_usuario')
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data)

# --- 11. ADMIN: LISTAR HISTORIAL ---
class AdminHistorialListView(APIView):
    def get(self, request):
        historial = HistorialMatch.objects.all().select_related('fk_id_usuario', 'fk_id_partidopolitico').order_by('-id_historial')[:100]
        serializer = HistorialAdminSerializer(historial, many=True)
        return Response(serializer.data)

# --- 12. ADMIN: CREAR HISTORIAL ---
@api_view(['POST'])
def admin_crear_historial(request):
    try:
        data = request.data
        usuario = Usuario.objects.get(id_usuario=data['usuario_id'])
        partido = PartidoPolitico.objects.get(id_partidopolitico=data['partido_id'])
        
        nuevo_match = HistorialMatch.objects.create(
            fk_id_usuario=usuario,
            fk_id_partidopolitico=partido,
            similitud_pct=data['similitud_pct']
        )
        return Response({'mensaje': 'Historial creado manualmente'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

# --- 13. ADMIN: ELIMINAR (DELETE) ---
@api_view(['DELETE'])
def eliminar_partido(request, pk):
    try:
        PartidoPolitico.objects.get(id_partidopolitico=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except PartidoPolitico.DoesNotExist:
        return Response({'error': 'No existe'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def eliminar_pregunta(request, pk):
    try:
        Pregunta.objects.get(id_pregunta=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Pregunta.DoesNotExist:
        return Response({'error': 'No existe'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def eliminar_usuario(request, pk):
    try:
        Usuario.objects.get(id_usuario=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Usuario.DoesNotExist:
        return Response({'error': 'No existe'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def eliminar_historial(request, pk):
    try:
        HistorialMatch.objects.get(id_historial=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except HistorialMatch.DoesNotExist:
        return Response({'error': 'No existe'}, status=status.HTTP_404_NOT_FOUND)

# --- 🆕 14. ADMIN: ACTUALIZAR PARTIDO (PUT) ---
@api_view(['PUT'])
def actualizar_partido(request, pk):
    try:
        partido = PartidoPolitico.objects.get(id_partidopolitico=pk)
        
        partido.candidato = request.data.get('candidato', partido.candidato)
        partido.lider = request.data.get('lider', partido.lider)
        partido.anio_fundacion = request.data.get('anio_fundacion', partido.anio_fundacion)
        partido.pill_color = request.data.get('pill_color', partido.pill_color)
        partido.logo = request.data.get('logo', partido.logo)
        partido.vector_ideologico = request.data.get('vector_ideologico', partido.vector_ideologico)
        
        partido.save()
        
        return Response({'mensaje': 'Partido actualizado correctamente'}, status=200)
    except PartidoPolitico.DoesNotExist:
        return Response({'error': 'Partido no encontrado'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

# --- 🆕 15. ADMIN: ACTUALIZAR PREGUNTA (PUT) ---
@api_view(['PUT'])
def actualizar_pregunta(request, pk):
    try:
        pregunta = Pregunta.objects.get(id_pregunta=pk)
        
        pregunta.enunciadopregunta = request.data.get('enunciadopregunta', pregunta.enunciadopregunta)
        pregunta.temacategoria = request.data.get('temacategoria', pregunta.temacategoria)
        pregunta.peso_impacto = request.data.get('peso_impacto', pregunta.peso_impacto)
        pregunta.vector_influencia = request.data.get('vector_influencia', pregunta.vector_influencia)
        
        pregunta.save()
        
        return Response({'mensaje': 'Pregunta actualizada correctamente'}, status=200)
    except Pregunta.DoesNotExist:
        return Response({'error': 'Pregunta no encontrada'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

# --- 🆕 16. ADMIN: ACTUALIZAR USUARIO (PUT) ---
@api_view(['PUT'])
def actualizar_usuario(request, pk):
    try:
        usuario = Usuario.objects.get(id_usuario=pk)
        
        usuario.nombre = request.data.get('nombre', usuario.nombre)
        usuario.email = request.data.get('email', usuario.email)
        
        nueva_password = request.data.get('password')
        if nueva_password:
            usuario.password = make_password(nueva_password)
        
        usuario.save()
        
        return Response({'mensaje': 'Usuario actualizado correctamente'}, status=200)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

# --- 🆕 17. ADMIN: ACTUALIZAR HISTORIAL (PUT) ---
@api_view(['PUT'])
def actualizar_historial(request, pk):
    try:
        historial = HistorialMatch.objects.get(id_historial=pk)
        
        usuario_id = request.data.get('usuario_id')
        if usuario_id:
            historial.fk_id_usuario = Usuario.objects.get(id_usuario=usuario_id)
        
        partido_id = request.data.get('partido_id')
        if partido_id:
            historial.fk_id_partidopolitico = PartidoPolitico.objects.get(id_partidopolitico=partido_id)
        
        historial.similitud_pct = request.data.get('similitud_pct', historial.similitud_pct)
        
        historial.save()
        
        return Response({'mensaje': 'Historial actualizado correctamente'}, status=200)
    except HistorialMatch.DoesNotExist:
        return Response({'error': 'Historial no encontrado'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

# --- 18. CARGA VIA EXCEL/CSV ---
@api_view(['POST'])
def upload_csv_partidos(request):
    try:
        file = request.FILES['file']
        
        if file.name.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.name.endswith('.xlsx'):
            df = pd.read_excel(file)
        else:
            return Response({'error': 'Formato no soportado. Use .csv o .xlsx'}, status=400)

        registros_creados = 0
        
        for index, row in df.iterrows():
            try:
                PartidoPolitico.objects.create(
                    candidato=row.get('candidato', 'Sin Nombre'),
                    lider=row.get('lider', ''),
                    anio_fundacion=row.get('fundacion', 2024),
                    pill_color=row.get('color', '#000000'),
                    vector_ideologico=f"[{row.get('eco', 0)}, {row.get('soc', 0)}]"
                )
                registros_creados += 1
            except Exception as e:
                print(f"Error en fila {index}: {e}")
                continue

        return Response({'mensaje': f'Se cargaron {registros_creados} partidos correctamente'}, status=201)

    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def upload_csv_preguntas(request):
    try:
        file = request.FILES['file']
        
        if file.name.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.name.endswith('.xlsx'):
            df = pd.read_excel(file)
        else:
            return Response({'error': 'Formato no soportado'}, status=400)

        df.columns = df.columns.str.strip().str.lower()
        
        print("Columnas encontradas en el Excel:", df.columns)

        registros_creados = 0
        errores = []

        for index, row in df.iterrows():
            try:
                Pregunta.objects.create(
                    enunciadopregunta=row.get('pregunta', 'Pregunta vacía'),
                    temacategoria=row.get('categoria', 'General'),
                    peso_impacto=float(str(row.get('peso', 1.0)).replace(',', '.')),
                    vector_influencia=f"[{row.get('eco', 0)}, {row.get('soc', 0)}]"
                )
                registros_creados += 1
            except Exception as e:
                print(f"❌ Error en fila {index}: {e}")
                errores.append(f"Fila {index}: {str(e)}")
                continue

        if registros_creados == 0:
            return Response({'error': 'No se cargó nada. Errores: ' + str(errores[:3])}, status=400)

        return Response({'mensaje': f'Se cargaron {registros_creados} preguntas correctamente'}, status=201)

    except Exception as e:
        return Response({'error': str(e)}, status=500)