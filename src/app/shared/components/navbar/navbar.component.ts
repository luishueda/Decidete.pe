import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../core/models/usuario.model'; // Asegúrate de tener este modelo

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html',
    styles: [] // Animaciones movidas a styles.css global
})
export class NavbarComponent implements OnInit {
    scrolled = false;
    mobileMenuOpen = false;
    userMenuOpen = false;
    user: Usuario | null = null;

    constructor(private router: Router) { }

    ngOnInit() {
        this.checkAuth();
    }

    // Detectar scroll para cambiar la sombra del navbar
    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.scrolled = window.scrollY > 10;
    }

    // Verificar sesión en localStorage
    checkAuth() {
        if (typeof window !== 'undefined') {
            const usuarioGuardado = localStorage.getItem('usuario_decide_pe');
            if (usuarioGuardado) {
                this.user = JSON.parse(usuarioGuardado);
            } else {
                this.user = null;
            }
        }
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    toggleUserMenu() {
        this.userMenuOpen = !this.userMenuOpen;
    }

    handleLogout() {
        localStorage.removeItem('usuario_decide_pe');
        this.user = null;
        this.userMenuOpen = false;
        this.router.navigate(['/auth/login']);
    }

    // Getter para saber si está autenticado
    get isAuthenticated(): boolean {
        return !!this.user;
    }
}