import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="text-center mb-12">
      <h2 class="text-[#3885A5] text-[2.75rem] font-bold mb-8 mt-20">Cómo funciona</h2>
      
      <div class="flex flex-col items-center gap-12">
        
        <!-- Paso 1 -->
        <div class="flex max-w-[719px] min-w-[719px] gap-8">
          <img [src]="responde" alt="Responde el quiz rápido" class="w-full max-w-[250px]" *ngIf="responde">
          <div *ngIf="!responde" class="w-full max-w-[250px] h-[250px] bg-red-100 rounded-xl flex items-center justify-center text-6xl">📝</div>
          
          <div class="flex flex-col mx-auto justify-center text-left">
            <h3 class="text-red-700 mb-2 text-xl font-bold">Responde el quiz rápido</h3>
            <p class="text-gray-700 text-[0.95rem]">
              Evalúa 10 afirmaciones generales para conocer tus afinidades políticas principales
            </p>
          </div>
        </div>

        <!-- Paso 2 -->
        <div class="flex max-w-[719px] min-w-[719px] gap-8">
          <div class="flex flex-col mx-auto justify-center text-right order-1">
            <h3 class="text-red-700 mb-2 text-xl font-bold">Analiza tus resultados</h3>
            <p class="text-gray-700 text-[0.95rem]">
              Visualiza qué partidos coinciden contigo según tus respuestas
            </p>
          </div>
          
          <img [src]="analiza" alt="Analiza tus resultados" class="w-full max-w-[250px] order-2" *ngIf="analiza">
          <div *ngIf="!analiza" class="w-full max-w-[250px] h-[250px] bg-blue-100 rounded-xl flex items-center justify-center text-6xl order-2">📊</div>
        </div>

        <!-- Paso 3 -->
        <div class="flex max-w-[719px] min-w-[719px] gap-8">
          <img [src]="profundiza" alt="Profundiza si lo deseas" class="w-full max-w-[250px]" *ngIf="profundiza">
          <div *ngIf="!profundiza" class="w-full max-w-[250px] h-[250px] bg-green-100 rounded-xl flex items-center justify-center text-6xl">🔍</div>
          
          <div class="flex flex-col mx-auto justify-center text-left">
            <h3 class="text-red-700 mb-2 text-xl font-bold">Profundiza si lo deseas</h3>
            <p class="text-gray-700 text-[0.95rem]">
              Luego podrás acceder al Quiz Completo con 20 preguntas por bloques temáticos
            </p>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: []
})
export class HowItWorksComponent {
  // Rutas de imágenes desde public/assets
  responde = '/responde.png';
  analiza = '/analiza.png';
  profundiza = '/profundiza.png';
}
