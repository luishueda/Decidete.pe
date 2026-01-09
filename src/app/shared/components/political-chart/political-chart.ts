import { Component, Input, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-political-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-full">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: []
})
export class PoliticalChartComponent implements OnInit, OnDestroy {
  @Input() userVector: number[] = [0, 0];
  @Input() partyVector: number[] = [0, 0];
  @Input() partyName: string = 'Partido';

  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;

  ngOnInit() {
    this.createChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart() {
    // Asegurar que los vectores sean arrays válidos
    const uVector = Array.isArray(this.userVector) ? this.userVector : [0, 0];
    const pVector = Array.isArray(this.partyVector) ? this.partyVector : [0, 0];

    const config: ChartConfiguration<'scatter'> = {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Tú',
            data: [{ x: uVector[0], y: uVector[1] }],
            backgroundColor: '#e63946', // Rojo
            pointRadius: 10,
          },
          {
            label: this.partyName,
            data: [{ x: pVector[0], y: pVector[1] }],
            backgroundColor: '#2a9d8f', // Verde
            pointRadius: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            min: -10,
            max: 10,
            grid: {
              color: (ctx) => ctx.tick.value === 0 ? '#333' : '#eee',
              lineWidth: (ctx) => ctx.tick.value === 0 ? 2 : 1,
            },
            title: {
              display: true,
              text: 'Economía: Izquierda (-10) <---> Derecha (+10)',
            },
          },
          y: {
            min: -10,
            max: 10,
            grid: {
              color: (ctx) => ctx.tick.value === 0 ? '#333' : '#eee',
              lineWidth: (ctx) => ctx.tick.value === 0 ? 2 : 1,
            },
            title: {
              display: true,
              text: 'Social: Liberal (-10) <---> Conservador (+10)',
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (ctx: any) => `${ctx.dataset.label}: (${ctx.raw.x}, ${ctx.raw.y})`,
            },
          },
        },
      },
    };

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, config);
    }
  }
}
