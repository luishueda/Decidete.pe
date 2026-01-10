import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PartidosService {
    private apiUrl = environment.apiUrl;
    private cache = new Map<string, any>(); // Caché simple

    constructor(private http: HttpClient) { }

    /**
     * Obtener resumen de todos los partidos
     */
    getPartidosResumen(): Observable<any[]> {
        const cacheKey = 'partidos_resumen';

        // Si está en caché, devolver desde caché
        if (this.cache.has(cacheKey)) {
            console.log('✅ Cargando desde caché:', cacheKey);
            return of(this.cache.get(cacheKey));
        }

        // Si no, hacer petición y guardar en caché
        return this.http.get<any[]>(`${this.apiUrl}/partidos/resumen/`).pipe(
            tap(data => {
                this.cache.set(cacheKey, data);
                console.log('💾 Guardado en caché:', cacheKey);
            })
        );
    }

    /**
     * Obtener comparación/detalles de partidos por IDs
     */
    getComparacion(ids: number[]): Observable<any> {
        const cacheKey = `comparacion_${ids.join('_')}`;

        // Si está en caché, devolver inmediatamente
        if (this.cache.has(cacheKey)) {
            console.log('⚡ Cargando desde caché:', cacheKey);
            return of(this.cache.get(cacheKey));
        }

        // Si no, hacer petición y guardar
        return this.http.post<any>(`${this.apiUrl}/partidos/comparar/`, { ids }).pipe(
            tap(data => {
                this.cache.set(cacheKey, data);
                console.log('💾 Guardado en caché:', cacheKey);
            })
        );
    }

    /**
     * Comparar partidos por IDs
     * @param ids - Array de IDs de partidos a comparar
     */
    compararPartidos(ids: number[]): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/partidos/comparar/`, { ids });
    }

    /**
     * Limpiar caché (útil para refrescar datos)
     */
    limpiarCache() {
        this.cache.clear();
        console.log('🗑️ Caché limpiado');
    }
}