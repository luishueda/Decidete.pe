import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizCardComponent } from '../../shared/components/quiz-card/quiz-card.component';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { QuizService } from '../../core/services/quiz.service';

@Component({
    selector: 'app-quiz-completo',
    standalone: true,
    imports: [CommonModule, QuizCardComponent, HeroComponent],
    templateUrl: './quiz-completo.html',
    styles: []
})
export class QuizCompletoComponent implements OnInit {
    questions: any[] = [];
    answers: { [key: number]: number } = {};
    loading = true;

    constructor(
        private quizService: QuizService,
        private router: Router
    ) { }

    ngOnInit() {
        this.cargarPreguntas();
    }

    async cargarPreguntas() {
        try {
            // Pedimos TODAS las preguntas (sin filtro de modo rápido)
            const data = await this.quizService.getPreguntas(null).toPromise();

            if (data && data.length > 0) {
                this.questions = data; // Guardamos TODAS las preguntas
            } else {
                console.warn('Backend devolvió lista vacía');
            }
        } catch (error) {
            console.error('Error al cargar preguntas:', error);
        } finally {
            this.loading = false;
        }
    }

    handleAnswer(id: number, value: number) {
        this.answers[id] = value;
    }

    async handleFinalizar() {
        // Validación
        if (Object.keys(this.answers).length < this.questions.length) {
            const confirmar = window.confirm('No has respondido todas. ¿Finalizar igual?');
            if (!confirmar) return;
        }

        const usuarioStorage = localStorage.getItem('usuario_decide_pe');
        let usuarioId = null;

        if (usuarioStorage) {
            try {
                const usuarioObj = JSON.parse(usuarioStorage);
                usuarioId = usuarioObj.id_usuario || usuarioObj.id;
            } catch (e) {
                console.warn(e);
            }
        }

        const payload = {
            respuestas: Object.keys(this.answers).map((id) => ({
                pregunta_id: parseInt(id),
                respuesta: this.answers[+id],
            })),
            usuario_id: usuarioId,
        };

        try {
            this.loading = true;
            const resultado = await this.quizService.enviarRespuestas(payload).toPromise();
            this.router.navigate(['/resultados'], { state: { resultados: resultado } });
        } catch (error) {
            console.error(error);
            alert('Error al conectar con el servidor.');
            this.loading = false;
        }
    }

    volverAlMenu() {
        this.router.navigate(['/quiz']);
    }

    get preguntasRespondidas() {
        return Object.keys(this.answers).length;
    }

    get progresoPercentaje() {
        return (this.preguntasRespondidas / this.questions.length) * 100;
    }
}
