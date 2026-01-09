import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardHomeComponent } from '../../shared/components/card-home/card-home.component';
import { TableHomeComponent } from '../../shared/components/table-home/table-home.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CardHomeComponent, TableHomeComponent],
  templateUrl: './home.html',
  styles: []
})
export class HomeComponent {
  // Datos de la tabla (como en React)
  tablaData = {
    partidos: ["Partido A", "Partido B", "Partido C"],
    temas: [
      {
        nombre: "Educación",
        propuestas: [
          "Becas y universidades públicas",
          "Infraestructura escolar rural",
          "Evaluación docente anual",
        ],
      },
      {
        nombre: "Salud",
        propuestas: [
          "Clínicas móviles regionales",
          "Historias clínicas digitales",
          "Atención primaria gratuita",
        ],
      },
      {
        nombre: "Economía",
        propuestas: [
          "Incentivos a MYPES",
          "Reducción de impuestos",
          "Inversión en infraestructura",
        ],
      },
      {
        nombre: "Seguridad",
        propuestas: [
          "Más comisarías locales",
          "Tecnología en vigilancia",
          "Penas más severas",
        ],
      },
    ],
  };

  // Rutas de imágenes desde la carpeta public
  heroBanner = '/partidos/home/hero-banner.png';
  brainIcon = '/partidos/home/icon-cerebro.png';
  barsIcon = '/partidos/home/icon-barras.png';
  balanceIcon = '/partidos/home/icon-balanza.png';
  portalImage = '/partidos/home/portal-image.png';
}
