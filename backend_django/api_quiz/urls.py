from django.urls import path
from .views import (
    historial_usuario,
    partidos_resumen_list, 
    preguntas_list, 
    calcular_quiz_match, 
    registrar_usuario, 
    login_usuario,
    comparar_partidos,
    CargaMasivaPreguntasView,   
    CargaMasivaPartidosView,    
    AdminUsuarioListView,
    AdminHistorialListView,
    admin_crear_historial,
    eliminar_partido, 
    eliminar_pregunta, 
    eliminar_usuario, 
    eliminar_historial,
    actualizar_partido,      
    actualizar_pregunta,     
    actualizar_usuario,     
    actualizar_historial,    
    upload_csv_partidos,       
    upload_csv_preguntas       
)

urlpatterns = [
    # --- PARTIDOS ---
    path('partidos/resumen/', partidos_resumen_list, name='partidos-resumen'), 
    path('partidos/comparar/', comparar_partidos, name='comparar-partidos'),   
    
    # --- QUIZ ---
    path('quiz/preguntas/', preguntas_list, name='preguntas-list'), 
    path('quiz/calcular/', calcular_quiz_match, name='calcular-quiz'), 
    
    # --- AUTH ---
    path('auth/registro/', registrar_usuario, name='auth-registro'),
    path('auth/login/', login_usuario, name='auth-login'),
    path('auth/historial/', historial_usuario, name='historial-usuario'),

    # --- ADMIN (CARGA JSON) ---
    path('admin/carga-preguntas/', CargaMasivaPreguntasView.as_view()),
    path('admin/carga-partidos/', CargaMasivaPartidosView.as_view()),

    # --- ADMIN (CARGA EXCEL) ---
    path('admin/upload-partidos/', upload_csv_partidos),   
    path('admin/upload-preguntas/', upload_csv_preguntas),  

    # --- ADMIN (LISTAR) ---
    path('admin/usuarios/', AdminUsuarioListView.as_view()),
    path('admin/historial-global/', AdminHistorialListView.as_view()), 
    path('admin/crear-historial/', admin_crear_historial), 
    
    # --- ADMIN (ELIMINAR) ---
    path('admin/eliminar-partido/<int:pk>/', eliminar_partido),
    path('admin/eliminar-pregunta/<int:pk>/', eliminar_pregunta),
    path('admin/eliminar-usuario/<int:pk>/', eliminar_usuario),
    path('admin/eliminar-historial/<int:pk>/', eliminar_historial),
    
    # --- 🆕 ADMIN (ACTUALIZAR) ---
    path('admin/actualizar-partido/<int:pk>/', actualizar_partido),
    path('admin/actualizar-pregunta/<int:pk>/', actualizar_pregunta),
    path('admin/actualizar-usuario/<int:pk>/', actualizar_usuario),
    path('admin/actualizar-historial/<int:pk>/', actualizar_historial),
]