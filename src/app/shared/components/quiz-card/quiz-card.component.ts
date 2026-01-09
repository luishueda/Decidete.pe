import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface QuizOption {
    label: string;
    value: number;
}

@Component({
    selector: 'app-quiz-card',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="bg-white shadow-md rounded-2xl p-6 mb-8 text-left">
      <p class="font-semibold mb-4 text-gray-900">
        {{ question.enunciadopregunta || question.text }}
      </p>
      
      <form>
        <label 
          *ngFor="let op of options; let i = index" 
          class="flex items-center gap-2 mb-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
        >
          <input
            type="radio"
            [name]="'q-' + question.id_pregunta"
            [value]="op.value"
            [checked]="selected === op.value"
            (change)="onChange.emit(op.value)"
            class="w-4 h-4 text-red-700 focus:ring-red-700"
          />
          <span class="text-gray-700">{{ op.label }}</span>
        </label>
      </form>
    </div>
  `,
    styles: []
})
export class QuizCardComponent {
    @Input() question: any;
    @Input() selected: number | undefined;
    @Output() onChange = new EventEmitter<number>();

    options: QuizOption[] = [
        { label: "Totalmente en desacuerdo", value: 1 },
        { label: "En desacuerdo", value: 2 },
        { label: "No sabe / No opina", value: 3 },
        { label: "De acuerdo", value: 4 },
        { label: "Totalmente de acuerdo", value: 5 },
    ];
}
