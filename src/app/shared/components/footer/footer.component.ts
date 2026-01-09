import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styles: [] // Usamos Tailwind, no necesitamos CSS externo
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
