import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-hero',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="bg-red-700 text-white text-center py-12 px-4">
      <h1 class="text-[2rem] font-bold m-0">{{ title }}</h1>
      <p class="mt-2 text-base">{{ description }}</p>
    </section>
  `,
    styles: []
})
export class HeroComponent {
    @Input() title: string = '';
    @Input() description: string = '';
}
