export interface Partido {
    id_partidopolitico: number;
    candidato: string;       // Nombre del partido o candidato
    lider?: string;          // El '?' significa que puede ser nulo
    anio_fundacion?: number;
    pill_color?: string;     // Ej: '#FF0000'
    logo?: string;           // URL del logo
    vector_ideologico?: string; // Viene como string "[1, 2]" desde Django

    // Campos extra para el detalle
    representacion_actual?: string;
    financiamiento?: string;
    descripcion_corta?: string;
    historia_breve?: string;
    propuestas_clave?: string;
    sentencias?: string;
}