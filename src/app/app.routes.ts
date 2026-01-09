import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { QuizComponent } from './features/quiz/quiz';
import { QuizCompletoComponent } from './features/quiz/quiz-completo';
import { ResultsComponent } from './features/results/results';
import { LoginComponent } from './features/auth/login';
import { PortalComponent } from './features/portal/portal';
import { PartidoDetalleComponent } from './features/partido-detalle/partido-detalle';
import { ComparadorComponent } from './features/comparador/comparador';
import { PerfilComponent } from './features/perfil/perfil';
import { HistorialComponent } from './features/historial/historial';
import { NosotrosComponent } from './features/nosotros/nosotros';
import { AdminDashboardComponent } from './features/admin-dashboard/admin-dashboard';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'nosotros', component: NosotrosComponent },
    { path: 'quiz', component: QuizComponent },
    { path: 'quiz-completo', component: QuizCompletoComponent },
    { path: 'resultados', component: ResultsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'portal', component: PortalComponent },
    { path: 'partido/:id', component: PartidoDetalleComponent },
    { path: 'comparador', component: ComparadorComponent },
    { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
    { path: 'historial', component: HistorialComponent, canActivate: [authGuard] },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
    { path: '**', redirectTo: '' }
];
