import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TablaData {
  partidos: string[];
  temas: {
    nombre: string;
    propuestas: string[];
  }[];
}

@Component({
  selector: 'app-table-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-[900px] overflow-x-auto bg-white shadow-lg rounded-lg">
      <table class="w-full border-collapse max-md:min-w-[500px]">
        <thead>
          <tr class="bg-red-700">
            <th class="font-sans text-white font-bold text-sm p-4 text-left border-b-2 border-white max-md:p-2 max-md:text-xs">Tema</th>
            <th *ngFor="let partido of data.partidos" 
                class="font-sans text-white font-bold text-sm p-4 text-center border-b-2 border-white min-w-[150px] max-md:p-1 max-md:text-[10px] max-md:min-w-[80px]">
              {{ partido }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let tema of data.temas; let i = index" 
              [class]="i % 2 === 0 ? 'bg-gray-50' : 'bg-white'">
            <td class="font-sans text-black font-semibold text-sm p-4 border-b border-gray-200">
              {{ tema.nombre }}
            </td>
            <td *ngFor="let propuesta of tema.propuestas" 
                class="font-sans text-gray-700 font-normal text-sm p-4 text-center border-b border-gray-200">
              {{ propuesta }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: []
})
export class TableHomeComponent {
  @Input() data: TablaData = { partidos: [], temas: [] };
}
