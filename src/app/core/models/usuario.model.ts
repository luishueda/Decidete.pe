export interface Usuario {
    id?: number;           // Login devuelve 'id'
    id_usuario?: number;   // Registro devuelve 'id_usuario'
    nombre: string;
    apellidos?: string;
    email: string;
}

export interface HistorialMatch {
    id: number;
    partido: string;
    porcentaje: number;
    color?: string;
}