import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-floating-nav',
    standalone: true,
    imports: [CommonModule],
    template: `
    <!-- Botón Flotante -->
    <button 
      *ngIf="showButton"
      (click)="toggleMenu()"
      class="fixed bottom-6 right-6 z-[999] w-14 h-14 bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none max-md:bottom-5 max-md:right-5"
      aria-label="Menú de navegación rápida"
    >
      <svg *ngIf="!menuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
      <svg *ngIf="menuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>

    <!-- Menú Desplegable -->
    <div 
      *ngIf="menuOpen && showButton"
      class="fixed bottom-24 right-6 z-[998] bg-white rounded-2xl shadow-2xl p-4 min-w-[200px] animate-[slideUp_0.3s_ease] max-md:bottom-20 max-md:right-5"
    >
      <nav class="flex flex-col gap-2">
        <a 
          *ngFor="let item of navItems"
          [href]="item.path"
          (click)="navigateTo(item.path, $event)"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-800 font-semibold text-sm transition-all duration-200 hover:bg-red-50 hover:text-red-700 no-underline"
        >
          <span class="text-xl">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </a>
      </nav>
    </div>

    <!-- Overlay -->
    <div 
      *ngIf="menuOpen"
      (click)="toggleMenu()"
      class="fixed inset-0 bg-black/20 z-[997]"
    ></div>
  `,
    styles: [`
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class FloatingNavComponent {
    menuOpen = false;
    showButton = false;

    navItems = [
        { path: '/', label: 'Inicio', icon: '🏠' },
        { path: '/nosotros', label: 'Nosotros', icon: 'ℹ️' },
        { path: '/quiz', label: 'Quiz Electoral', icon: '📝' },
        { path: '/comparador', label: 'Comparador', icon: '⚖️' },
        { path: '/portal', label: 'Portal', icon: '🏛️' }
    ];

    constructor(private router: Router) {
        // Mostrar botón solo cuando el usuario hace scroll
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', () => {
                this.showButton = window.scrollY > 300;
            });

            // Cerrar menú al cambiar de ruta
            this.router.events
                .pipe(filter(event => event instanceof NavigationEnd))
                .subscribe(() => {
                    this.menuOpen = false;
                });
        }
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    navigateTo(path: string, event: Event) {
        event.preventDefault();
        this.menuOpen = false;
        this.router.navigate([path]);

        // Scroll suave al inicio
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}
