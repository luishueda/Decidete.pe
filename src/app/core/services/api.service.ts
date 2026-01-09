import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    // Inyección de dependencia moderna (Angular 16+)
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl; // Viene de tu archivo environment

    constructor() { }

    /**
     * GET Genérico
     * @param endpoint ej: '/quiz/preguntas'
     * @param params (Opcional) Query params
     */
    get<T>(endpoint: string, params?: any): Observable<T> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    httpParams = httpParams.set(key, params[key]);
                }
            });
        }

        return this.http.get<T>(`${this.apiUrl}${endpoint}`, { params: httpParams })
            .pipe(catchError(this.handleError));
    }

    /**
     * POST Genérico
     */
    post<T>(endpoint: string, body: any): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}${endpoint}`, body)
            .pipe(catchError(this.handleError));
    }

    /**
     * PUT Genérico
     */
    put<T>(endpoint: string, body: any): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}${endpoint}`, body)
            .pipe(catchError(this.handleError));
    }

    /**
     * DELETE Genérico
     */
    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${this.apiUrl}${endpoint}`)
            .pipe(catchError(this.handleError));
    }

    // Manejo centralizado de errores
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Ocurrió un error desconocido';

        if (error.error instanceof ErrorEvent) {
            // Error del lado del cliente
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Error del lado del servidor (Django devolvió 400, 500, etc.)
            console.error(`Backend returned code ${error.status}, body was:`, error.error);
            errorMessage = error.error?.error || error.error?.mensaje || `Error del servidor: ${error.status}`;
        }

        // Retornamos un error observable para que el componente sepa que falló
        return throwError(() => new Error(errorMessage));
    }
}