import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { PartidosService } from '../../core/services/partidos.service';

interface PartidoResumen {
    id_partidopolitico: number;
    lider: string;
    candidato: string;
    logo: string;
    pill_color: string;
}

@Component({
    selector: 'app-comparador',
    standalone: true,
    imports: [CommonModule, FormsModule, HeroComponent],
    templateUrl: './comparador.html',
    styles: []
})
export class ComparadorComponent {
    partidosDisponibles: PartidoResumen[] = [];
    partidosSeleccionados: PartidoResumen[] = [];
    mostrarTablas = false;
    datosComparacion: any = null;

    searchTerm = '';
    dropdownOpen = false;

    constructor(private partidosService: PartidosService) {
        this.cargarPartidos();
    }

    cargarPartidos() {
        this.partidosService.getPartidosResumen().subscribe({
            next: (data) => {
                this.partidosDisponibles = data;
            },
            error: (err) => console.error('Error cargando partidos:', err)
        });
    }

    get partidosFiltrados() {
        if (!this.searchTerm) return this.partidosDisponibles;

        const term = this.searchTerm.toLowerCase();
        return this.partidosDisponibles.filter(p =>
            p.lider?.toLowerCase().includes(term) ||
            p.candidato?.toLowerCase().includes(term)
        );
    }

    get isCompararDisabled(): boolean {
        return this.partidosSeleccionados.length < 2;
    }

    agregarPartido(partido: PartidoResumen) {
        if (this.partidosSeleccionados.length >= 4) {
            alert('Máximo 4 partidos para comparar');
            return;
        }

        const yaSeleccionado = this.partidosSeleccionados.find(
            p => p.id_partidopolitico === partido.id_partidopolitico
        );

        if (!yaSeleccionado) {
            this.partidosSeleccionados.push(partido);
            this.searchTerm = '';
            this.dropdownOpen = false;
        }
    }

    eliminarPartido(partido: PartidoResumen) {
        this.partidosSeleccionados = this.partidosSeleccionados.filter(
            p => p.id_partidopolitico !== partido.id_partidopolitico
        );
        this.mostrarTablas = false;
    }

    handleComparar() {
        if (this.partidosSeleccionados.length < 2) return;

        const ids = this.partidosSeleccionados.map(p => p.id_partidopolitico);

        this.partidosService.compararPartidos(ids).subscribe({
            next: (data) => {
                this.datosComparacion = data;
                this.mostrarTablas = true;
                console.log('Datos comparación:', data);
            },
            error: (err) => {
                console.error('Error comparando:', err);
                alert('Error al comparar partidos');
            }
        });
    }

    get categoriasPrincipales(): string[] {
        if (!this.datosComparacion) return [];
        const primerPartido = Object.values(this.datosComparacion)[0] as any;
        return Object.keys(primerPartido).filter(key =>
            key !== 'logo' && key !== 'color'
        );
    }
}
