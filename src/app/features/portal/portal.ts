import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { PortalCardComponent } from '../../shared/components/portal-card/portal-card.component';
import { PartidosService } from '../../core/services/partidos.service';

interface PartidoResumen {
    id_partidopolitico: number;
    lider: string;          // Nombre del líder/candidato
    candidato: string;      // Nombre del partido
    logo: string;
    pill_color: string;
}

@Component({
    selector: 'app-portal',
    standalone: true,
    imports: [CommonModule, FormsModule, HeroComponent, PortalCardComponent],
    templateUrl: './portal.html',
    styles: []
})
export class PortalComponent implements OnInit {
    searchTerm = '';
    partidos: PartidoResumen[] = [];
    loading = true;

    // Paginación
    currentPage = 1;
    itemsPerPage = 12;

    portalImage = '/partidos/portal.png';

    constructor(private partidosService: PartidosService) { }

    ngOnInit() {
        this.cargarPartidos();
    }

    cargarPartidos() {
        this.partidosService.getPartidosResumen().subscribe({
            next: (data) => {
                this.partidos = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error cargando partidos:', error);
                this.loading = false;
            }
        });
    }

    onSearchChange() {
        this.currentPage = 1;
    }

    get filteredPartidos() {
        if (!this.searchTerm) return this.partidos;

        const term = this.searchTerm.toLowerCase();
        return this.partidos.filter(partido =>
            partido.candidato?.toLowerCase().includes(term) ||
            partido.lider?.toLowerCase().includes(term)
        );
    }

    get currentPartidos() {
        const indexOfLastItem = this.currentPage * this.itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - this.itemsPerPage;
        return this.filteredPartidos.slice(indexOfFirstItem, indexOfLastItem);
    }

    get totalPages() {
        return Math.ceil(this.filteredPartidos.length / this.itemsPerPage);
    }

    get pageNumbers() {
        return Array(this.totalPages).fill(0).map((_, i) => i + 1);
    }

    paginate(pageNumber: number) {
        this.currentPage = pageNumber;
        const catalogo = document.getElementById('catalogo-start');
        if (catalogo) {
            catalogo.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
