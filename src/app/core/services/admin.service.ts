import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // ========== PARTIDOS ==========
    getPartidos(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/partidos/resumen/`);
    }

    crearPartido(partido: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/admin/carga-partidos/`, [partido]);
    }

    actualizarPartido(id: number, partido: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/admin/actualizar-partido/${id}/`, partido);
    }

    eliminarPartido(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/admin/eliminar-partido/${id}/`);
    }

    uploadPartidos(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.baseUrl}/admin/upload-partidos/`, formData);
    }

    // ========== PREGUNTAS ==========
    getPreguntas(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/quiz/preguntas/`);
    }

    crearPregunta(pregunta: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/admin/carga-preguntas/`, [pregunta]);
    }

    actualizarPregunta(id: number, pregunta: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/admin/actualizar-pregunta/${id}/`, pregunta);
    }

    eliminarPregunta(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/admin/eliminar-pregunta/${id}/`);
    }

    uploadPreguntas(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.baseUrl}/admin/upload-preguntas/`, formData);
    }

    // ========== USUARIOS ==========
    getUsuarios(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/admin/usuarios/`);
    }

    crearUsuario(usuario: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/auth/registro/`, usuario);
    }

    actualizarUsuario(id: number, usuario: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/admin/actualizar-usuario/${id}/`, usuario);
    }

    eliminarUsuario(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/admin/eliminar-usuario/${id}/`);
    }

    // ========== HISTORIAL ==========
    getHistorial(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/admin/historial-global/`);
    }

    crearHistorial(historial: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/admin/crear-historial/`, historial);
    }

    actualizarHistorial(id: number, historial: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/admin/actualizar-historial/${id}/`, historial);
    }

    eliminarHistorial(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/admin/eliminar-historial/${id}/`);
    }
}
