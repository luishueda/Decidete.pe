import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class QuizService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /**
     * Obtener preguntas del quiz
     * @param modo - 'rapido' para quiz rápido, null para todas las preguntas
     */
    getPreguntas(modo: string | null = null): Observable<any[]> {
        let params = new HttpParams();
        if (modo) {
            params = params.set('modo', modo);
        }
        return this.http.get<any[]>(`${this.apiUrl}/quiz/preguntas/`, { params });
    }

    /**
     * Enviar respuestas del quiz y calcular match
     * @param payload - { respuestas: [...], usuario_id: number | null }
     */
    enviarRespuestas(payload: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/quiz/calcular/`, payload);
    }
}