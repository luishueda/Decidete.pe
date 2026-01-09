import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PartidosService } from '../../core/services/partidos.service';

@Component({
    selector: 'app-partido-detalle',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './partido-detalle.html',
    styles: []
})
export class PartidoDetalleComponent implements OnInit {
    partido: any = null;
    loading = true;
    error: string | null = null;
    colorTema = '#e63946';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private partidosService: PartidosService
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.cargarPartido(parseInt(id));
        } else {
            this.error = 'ID de partido no válido';
            this.loading = false;
        }
        window.scrollTo(0, 0);
    }

    cargarPartido(id: number) {
        this.partidosService.getComparacion([id]).subscribe({
            next: (data) => {
                console.log('📦 Datos recibidos:', data);

                if (data && typeof data === 'object' && Object.keys(data).length > 0) {
                    const primerKey = Object.keys(data)[0];
                    this.partido = data[primerKey];
                    this.colorTema = this.partido.color || this.partido.pill_color || '#e63946';
                    console.log('✅ Partido cargado:', this.partido);
                } else {
                    this.error = 'No se encontraron datos para este partido';
                }
                this.loading = false;
            },
            error: (err) => {
                console.error('❌ Error:', err);
                this.error = 'No se pudo conectar con el servidor';
                this.loading = false;
            }
        });
    }

    get nombrePartido(): string {
        return this.partido?.['Nombre del partido'] || this.partido?.candidato || 'Sin nombre';
    }

    get lider(): string {
        return this.partido?.lider || 'Líder no especificado';
    }

    get logoUrl(): string {
        return this.partido?.logo || 'https://via.placeholder.com/150';
    }

    get fundacion(): string {
        return this.partido?.['Fecha de inscripción'] || this.partido?.anio_fundacion || 'No disponible';
    }

    get tendencia(): string {
        return this.partido?.['Tendencia política'] || 'No definida';
    }

    get financiamiento(): string {
        return this.partido?.['Financiamiento'] || 'No especificado';
    }

    get representacion(): string {
        return this.partido?.['Representación actual'] || 'Inscrito JNE';
    }

    get descripcion(): string {
        return this.partido?.descripcion_corta || 'Información en proceso de carga.';
    }

    get historia(): string {
        return this.partido?.historia_breve || '';
    }

    get propuestas(): string {
        return this.partido?.propuestas_clave || '• Plan de gobierno en revisión.';
    }

    get sentencias(): string {
        return this.partido?.sentencias || 'No se registran antecedentes graves.';
    }

    handleImageError(event: any) {
        event.target.src = 'https://via.placeholder.com/150?text=Sin+Logo';
    }
}
