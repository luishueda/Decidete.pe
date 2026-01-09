export interface Historial {
    id_historial: number;
    usuario_id: number;
    partido_id: number;
    similitud_pct: number;

    // Campos extra para mostrar en la tabla (vienen del serializer)
    nombre_usuario?: string;
    nombre_partido?: string;
    color?: string; // Para pintar la barrita en el historial
}