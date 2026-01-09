import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Usuario, HistorialMatch } from '../../core/models/usuario.model';

@Component({
    selector: 'app-historial',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './historial.html',
    styles: []
})
export class HistorialComponent implements OnInit {
    historial: HistorialMatch[] = [];
    loading = true;
    usuario: Usuario | null = null;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        // 1. Verificar usuario logueado
        const usuarioGuardado = this.authService.getUsuario();

        if (!usuarioGuardado) {
            this.router.navigate(['/login']);
            return;
        }

        this.usuario = usuarioGuardado;
        console.log('👤 Usuario completo:', JSON.stringify(this.usuario, null, 2));
        if (this.usuario) {
            console.log('🔑 Campos disponibles:', Object.keys(this.usuario));
        }

        // 2. Cargar historial
        this.cargarHistorial();
    }

    cargarHistorial() {
        if (!this.usuario) return;

        // Usar 'id' porque localStorage guarda 'id', no 'id_usuario'
        const userId = (this.usuario as any).id || (this.usuario as any).id_usuario;
        console.log('🔍 Cargando historial para usuario ID:', userId);

        this.authService.getHistorial(userId).subscribe({
            next: (datos) => {
                console.log('✅ Historial recibido del backend:', datos);
                console.log('📊 Cantidad de registros:', datos.length);
                this.historial = datos;
                this.loading = false;
            },
            error: (error) => {
                console.error('❌ Error cargando historial:', error);
                console.error('📍 Status:', error.status);
                console.error('📍 Mensaje:', error.message);
                this.loading = false;
            }
        });
    }

    irAlQuiz() {
        this.router.navigate(['/quiz']);
    }

    getColorPorcentaje(porcentaje: number): string {
        return porcentaje > 80 ? '#28a745' : '#e63946';
    }
}
