import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models/usuario.model';

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [CommonModule, HeroComponent],
    templateUrl: './perfil.html',
    styles: []
})
export class PerfilComponent implements OnInit {
    usuario: Usuario | null = null;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        const data = this.authService.getUsuario();
        if (data) {
            this.usuario = data;
        } else {
            this.router.navigate(['/login']);
        }
    }

    get inicial(): string {
        return this.usuario?.nombre
            ? this.usuario.nombre.charAt(0).toUpperCase()
            : 'U';
    }

    get nombreCompleto(): string {
        if (!this.usuario) return '';
        return `${this.usuario.nombre} ${this.usuario.apellidos || ''}`.trim();
    }

    handleLogout() {
        this.authService.logout();
        this.router.navigate(['/login']);
        window.location.reload();
    }

    verHistorial() {
        this.router.navigate(['/historial']);
    }
}
