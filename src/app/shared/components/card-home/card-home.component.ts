import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center text-center max-w-[300px] p-6 bg-white rounded-xl transition-all duration-300 hover:-translate-y-1 max-md:max-w-[180px] max-md:p-2">
      <div class="w-[100px] h-[100px] mb-6 flex items-center justify-center bg-red-100 rounded-full max-md:w-[40px] max-md:h-[40px] max-md:mb-2">
        <img [src]="imagen" [alt]="titulo" class="w-[60px] h-[60px] object-contain max-md:w-[25px] max-md:h-[25px]" *ngIf="imagen">
        <div *ngIf="!imagen" class="w-[60px] h-[60px] bg-red-700 rounded-full"></div>
      </div>
      <h3 class="font-sans text-black font-bold text-lg mb-3 max-md:text-xs max-md:mb-1">{{ titulo }}</h3>
      <p class="font-sans text-gray-700 font-normal text-base leading-relaxed max-md:text-[10px] max-md:leading-tight">{{ texto }}</p>
    </div>
  `,
  styles: []
})
export class CardHomeComponent {
  @Input() imagen: string = '';
  @Input() titulo: string = '';
  @Input() texto: string = '';
}
