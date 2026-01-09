import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { PoliticalChartComponent } from '../../shared/components/political-chart/political-chart';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterLink, HeroComponent, PoliticalChartComponent],
  templateUrl: './results.html',
  styles: []
})
export class ResultsComponent implements OnInit {
  resultados: any = null;

  constructor(private router: Router) {
    // Obtener resultados del state del router
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.resultados = navigation.extras.state['resultados'];
    }
  }

  ngOnInit() {
    // Si no hay resultados, redirigir al quiz
    if (!this.resultados) {
      this.router.navigate(['/quiz']);
    } else {
      // Scroll al inicio
      window.scrollTo(0, 0);
    }
  }

  handleShareWhatsApp() {
    const numero = '51993887382';
    const texto = `¡Hola! Acabo de hacer el quiz en Decide.pe y mi resultado fue: ${this.resultados.similitud_final}% compatible con ${this.resultados.partido_mas_afin}.`;

    // Generar link de WhatsApp
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

    // Abrir en nueva pestaña
    window.open(url, '_blank');
  }

  repetirQuiz() {
    this.router.navigate(['/quiz']);
  }
}
