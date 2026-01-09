import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /**
     * Registrar nuevo usuario
     */
    registrarUsuario(userData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/registro/`, userData);
    }

    /**
     * Login de usuario
     */
    loginUsuario(credentials: { email: string; password: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/login/`, credentials);
    }

    /**
     * Obtener historial de un usuario
     */
    getHistorial(usuarioId: number): Observable<any[]> {
        return this.http.post<any[]>(`${this.apiUrl}/auth/historial/`, { usuario_id: usuarioId });
    }

    /**
     * Guardar usuario en localStorage
     */
    guardarUsuario(usuario: any): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('usuario_decide_pe', JSON.stringify(usuario));
        }
    }

    /**
     * Obtener usuario de localStorage
     */
    getUsuario(): any {
        if (typeof window !== 'undefined') {
            const usuarioStorage = localStorage.getItem('usuario_decide_pe');
            if (usuarioStorage) {
                try {
                    return JSON.parse(usuarioStorage);
                } catch (e) {
                    return null;
                }
            }
        }
        return null;
    }

    /**
     * Cerrar sesión
     */
    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('usuario_decide_pe');
        }
    }

    /**
     * Verificar si está autenticado
     */
    isAuthenticated(): boolean {
        return this.getUsuario() !== null;
    }
}
