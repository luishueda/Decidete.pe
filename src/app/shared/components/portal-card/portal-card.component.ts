import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portal-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 transition-all duration-300 hover:border-[#3885a5] hover:shadow-xl hover:-translate-y-2 cursor-pointer">
      
      <!-- Logo del partido -->
      <div class="p-6 flex flex-col items-center">
        <div class="w-32 h-32 mb-4 flex items-center justify-center bg-gray-50 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
          <img 
            [src]="partido.logo" 
            [alt]="partido.candidato"
            (error)="handleImageError($event)"
            class="w-full h-full object-contain"
          />
        </div>

        <!-- Nombre del Partido (candidato) -->
        <h3 class="font-sans text-lg font-bold text-gray-900 text-center mb-2 group-hover:text-[#3885a5] transition-colors">
          {{ partido.candidato }}
        </h3>

        <!-- Líder -->
        <p class="font-sans text-sm text-gray-600 text-center mb-4">
          {{ partido.lider || 'Líder por definir' }}
        </p>

        <!-- Botón Ver Más con color del partido -->
        <button
          (click)="verPerfil()"
          [style.background-color]="partidoColor"
          class="w-full text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:brightness-110 hover:shadow-lg transform hover:scale-105 border-none cursor-pointer">
          Ver Perfil Completo
          <span class="ml-2">→</span>
        </button>
      </div>

      <!-- Badge superior derecha -->
      <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="bg-[#3885a5] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          Ver detalles
        </div>
      </div>
    </div>
  `
})
export class PortalCardComponent {
  @Input() partido: {
    id_partidopolitico: number;
    lider: string;
    candidato: string;
    logo: string;
    pill_color: string;
  } = {
      id_partidopolitico: 0,
      lider: '',
      candidato: '',
      logo: '',
      pill_color: '#BF1F1F'
    };

  constructor(private router: Router) { }

  get partidoColor(): string {
    const color = this.partido.pill_color || '#BF1F1F';
    return color;
  }

  handleImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/150?text=Logo';
  }

  verPerfil() {
    this.router.navigate(['/partido', this.partido.id_partidopolitico]);
  }
}
