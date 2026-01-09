import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizCardComponent } from '../../shared/components/quiz-card/quiz-card.component';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { HowItWorksComponent } from '../../shared/components/how-it-works/how-it-works.component';
import { QuizService } from '../../core/services/quiz.service';

@Component({
    selector: 'app-quiz',
    standalone: true,
    imports: [CommonModule, QuizCardComponent, HeroComponent, HowItWorksComponent],
    templateUrl: './quiz.html',
    styles: []
})
export class QuizComponent implements OnInit {
    questions: any[] = [];
    current = 0;
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
            // Pedimos TODAS las preguntas del backend
            const data = await this.quizService.getPreguntas('rapido').toPromise();

            if (data && data.length > 0) {
                // Tomamos solo las primeras 6 preguntas para el modo rápido
                this.questions = data.slice(0, 6);
            } else {
                console.warn('No hay preguntas en la base de datos.');
            }
        } catch (error) {
            console.error('Error cargando preguntas:', error);
        } finally {
            this.loading = false;
        }
    }

    handleAnswer(id: number, value: number) {
        this.answers[id] = value;
    }

    next() {
        if (this.current < this.questions.length - 2) {
            this.current += 2;
        }
    }

    prev() {
        if (this.current > 0) {
            this.current -= 2;
        }
    }

    async handleFinalizar() {
        if (Object.keys(this.answers).length < this.questions.length) {
            alert('Por favor, responde todas las preguntas.');
            return;
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
            usuario_id: usuarioId
        };

        try {
            const resultado = await this.quizService.enviarRespuestas(payload).toPromise();
            this.router.navigate(['/resultados'], { state: { resultados: resultado } });
        } catch (error) {
            console.error(error);
            alert('Error al conectar con el servidor.');
        }
    }

    get visibleQuestions() {
        return this.questions.slice(this.current, this.current + 2);
    }

    get esUltimaPagina() {
        return this.current + 2 >= this.questions.length;
    }

    get progresoPercentaje() {
        return ((this.current + 2) / this.questions.length) * 100;
    }

    irQuizCompleto() {
        this.router.navigate(['/quiz-completo']);
    }
}
