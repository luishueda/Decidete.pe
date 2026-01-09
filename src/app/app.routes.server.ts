import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutas estáticas - Pre-render
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'nosotros',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'quiz',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'quiz-completo',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'portal',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'comparador',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  // Rutas dinámicas o con auth - Client-side render
  {
    path: 'partido/**',
    renderMode: RenderMode.Client
  },
  {
    path: 'resultados',
    renderMode: RenderMode.Client
  },
  {
    path: 'perfil',
    renderMode: RenderMode.Client
  },
  {
    path: 'historial',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin',
    renderMode: RenderMode.Client
  },
  // Catch-all para cualquier otra ruta
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
