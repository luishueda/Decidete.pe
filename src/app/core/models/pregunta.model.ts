export interface Pregunta {
    id_pregunta: number;
    enunciadopregunta: string;
    peso_impacto: number;
    vector_influencia?: string; // Ej: "[1, 0]"
    temacategoria?: string;     // Ej: 'Economía'
    es_quiz_rapido: boolean;    // Para el filtro del Quiz Rápido
}