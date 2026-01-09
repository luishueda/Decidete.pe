import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-dashboard.html',
    styles: []
})
export class AdminDashboardComponent implements OnInit {
    activeTab: 'partidos' | 'preguntas' | 'usuarios' | 'historial' = 'partidos';
    showForm = false;
    isLoading = false;
    editingId: number | null = null;

    // Datos
    dataPartidos: any[] = [];
    dataPreguntas: any[] = [];
    dataUsuarios: any[] = [];
    dataHistorial: any[] = [];

    // Formularios
    formPartido = {
        candidato: '',
        lider: '',
        anio_fundacion: 2024,
        pill_color: '#FF6B00',
        logo: '',
        vec_eco: 0,
        vec_soc: 0
    };

    formPregunta = {
        enunciadopregunta: '',
        temacategoria: 'Economía',
        subcategoria: 'General',
        peso_impacto: 1.0,
        vec_eco: 0,
        vec_soc: 0
    };

    formUsuario = {
        nombre: '',
        email: '',
        password: ''
    };

    formHistorial = {
        usuario_id: '',
        partido_id: '',
        similitud_pct: 0
    };

    constructor(private adminService: AdminService) { }

    ngOnInit() {
        this.recargarTodo();
    }

    recargarTodo() {
        console.log('🔄 Recargando todos los datos...');

        this.adminService.getPartidos().subscribe({
            next: (data) => {
                console.log('✅ Partidos cargados:', data);
                this.dataPartidos = data;
            },
            error: (err) => {
                console.error('❌ Error cargando partidos:', err);
                this.dataPartidos = [];
            }
        });

        this.adminService.getPreguntas().subscribe({
            next: (data) => {
                console.log('✅ Preguntas cargadas:', data);
                this.dataPreguntas = data;
            },
            error: (err) => {
                console.error('❌ Error cargando preguntas:', err);
                this.dataPreguntas = [];
            }
        });

        this.adminService.getUsuarios().subscribe({
            next: (data) => {
                console.log('✅ Usuarios cargados:', data);
                console.log('📋 Primer usuario completo:', data[0]);
                this.dataUsuarios = data;
            },
            error: (err) => {
                console.error('❌ Error cargando usuarios:', err);
                this.dataUsuarios = [];
            }
        });

        this.adminService.getHistorial().subscribe({
            next: (data) => {
                console.log('✅ Historial cargado:', data);
                this.dataHistorial = data;
            },
            error: (err) => {
                console.error('❌ Error cargando historial:', err);
                this.dataHistorial = [];
            }
        });
    }

    cambiarTab(tab: 'partidos' | 'preguntas' | 'usuarios' | 'historial') {
        this.activeTab = tab;
        this.showForm = false;
    }

    handleNuevo() {
        this.editingId = null;
        this.resetFormularios();
        this.showForm = true;
    }

    resetFormularios() {
        this.formPartido = { candidato: '', lider: '', anio_fundacion: 2024, pill_color: '#FF6B00', logo: '', vec_eco: 0, vec_soc: 0 };
        this.formPregunta = { enunciadopregunta: '', temacategoria: 'Economía', subcategoria: 'General', peso_impacto: 1.0, vec_eco: 0, vec_soc: 0 };
        this.formUsuario = { nombre: '', email: '', password: '' };
        this.formHistorial = { usuario_id: '', partido_id: '', similitud_pct: 0 };
    }

    handleEdit(item: any, type: string) {
        const id = item.id_partidopolitico || item.id_pregunta || item.id_usuario || item.id_historial;
        this.editingId = id;

        if (type === 'partidos') {
            let vec = [0, 0];
            try {
                if (item.vector_ideologico) vec = JSON.parse(item.vector_ideologico);
            } catch (e) { }
            this.formPartido = {
                candidato: item.candidato,
                lider: item.lider || '',
                anio_fundacion: item.anio_fundacion || 2024,
                pill_color: item.pill_color || '#000000',
                logo: item.logo || '',
                vec_eco: vec[0],
                vec_soc: vec[1]
            };
        } else if (type === 'preguntas') {
            let vec = [0, 0];
            try {
                if (item.vector_influencia) vec = JSON.parse(item.vector_influencia);
            } catch (e) { }
            this.formPregunta = {
                enunciadopregunta: item.enunciadopregunta,
                temacategoria: item.temacategoria || 'Economía',
                subcategoria: item.subcategoria || 'General',
                peso_impacto: item.peso_impacto,
                vec_eco: vec[0],
                vec_soc: vec[1]
            };
        } else if (type === 'usuarios') {
            this.formUsuario = {
                nombre: item.nombre,
                email: item.email,
                password: ''
            };
        } else if (type === 'historial') {
            this.formHistorial = {
                usuario_id: item.fk_id_usuario || '',
                partido_id: item.fk_id_partidopolitico || '',
                similitud_pct: item.similitud_pct
            };
        }

        this.showForm = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    handleGuardar() {
        this.isLoading = true;

        if (this.activeTab === 'partidos') {
            const payload = {
                ...this.formPartido,
                vector_ideologico: `[${this.formPartido.vec_eco}, ${this.formPartido.vec_soc}]`
            };
            delete (payload as any).vec_eco;
            delete (payload as any).vec_soc;

            const request = this.editingId
                ? this.adminService.actualizarPartido(this.editingId, payload)
                : this.adminService.crearPartido(payload);

            request.subscribe({
                next: () => {
                    alert(this.editingId ? '✅ Actualizado' : '✅ Creado');
                    this.showForm = false;
                    this.editingId = null;
                    this.recargarTodo();
                    this.isLoading = false;
                },
                error: () => {
                    alert('❌ Error al guardar');
                    this.isLoading = false;
                }
            });
        } else if (this.activeTab === 'preguntas') {
            const payload = {
                ...this.formPregunta,
                vector_influencia: `[${this.formPregunta.vec_eco}, ${this.formPregunta.vec_soc}]`
            };
            delete (payload as any).vec_eco;
            delete (payload as any).vec_soc;

            const request = this.editingId
                ? this.adminService.actualizarPregunta(this.editingId, payload)
                : this.adminService.crearPregunta(payload);

            request.subscribe({
                next: () => {
                    alert(this.editingId ? '✅ Actualizado' : '✅ Creado');
                    this.showForm = false;
                    this.editingId = null;
                    this.recargarTodo();
                    this.isLoading = false;
                },
                error: () => {
                    alert('❌ Error al guardar');
                    this.isLoading = false;
                }
            });
        } else if (this.activeTab === 'usuarios') {
            const request = this.editingId
                ? this.adminService.actualizarUsuario(this.editingId, this.formUsuario)
                : this.adminService.crearUsuario(this.formUsuario);

            request.subscribe({
                next: () => {
                    alert(this.editingId ? '✅ Actualizado' : '✅ Creado');
                    this.showForm = false;
                    this.editingId = null;
                    this.recargarTodo();
                    this.isLoading = false;
                },
                error: () => {
                    alert('❌ Error al guardar');
                    this.isLoading = false;
                }
            });
        } else if (this.activeTab === 'historial') {
            const request = this.editingId
                ? this.adminService.actualizarHistorial(this.editingId, this.formHistorial)
                : this.adminService.crearHistorial(this.formHistorial);

            request.subscribe({
                next: () => {
                    alert(this.editingId ? '✅ Actualizado' : '✅ Creado');
                    this.showForm = false;
                    this.editingId = null;
                    this.recargarTodo();
                    this.isLoading = false;
                },
                error: () => {
                    alert('❌ Error al guardar');
                    this.isLoading = false;
                }
            });
        }
    }

    handleDelete(id: number, tipo: string) {
        if (!confirm('⚠️ ¿Eliminar registro? No se puede deshacer.')) return;

        let request;
        if (tipo === 'partido') request = this.adminService.eliminarPartido(id);
        else if (tipo === 'pregunta') request = this.adminService.eliminarPregunta(id);
        else if (tipo === 'usuario') request = this.adminService.eliminarUsuario(id);
        else if (tipo === 'historial') request = this.adminService.eliminarHistorial(id);
        else return;

        request.subscribe({
            next: () => {
                alert('🗑️ Eliminado');
                this.recargarTodo();
            },
            error: () => alert('❌ Error al eliminar')
        });
    }

    handleFileUpload(event: any, tipo: string) {
        const file = event.target.files[0];
        if (!file) return;

        this.isLoading = true;
        const request = tipo === 'partidos'
            ? this.adminService.uploadPartidos(file)
            : this.adminService.uploadPreguntas(file);

        request.subscribe({
            next: (res) => {
                alert(`✅ ${res.mensaje || 'Cargado correctamente'} `);
                this.recargarTodo();
                this.isLoading = false;
                event.target.value = null;
            },
            error: () => {
                alert('❌ Error al cargar archivo');
                this.isLoading = false;
                event.target.value = null;
            }
        });
    }
}
