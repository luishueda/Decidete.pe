import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const adminGuard = () => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    // Solo verificar en browser (no en SSR)
    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    // Verificar si hay usuario en localStorage
    const usuarioStorage = localStorage.getItem('usuario_decide_pe');

    if (!usuarioStorage) {
        console.log('❌ AdminGuard: No hay usuario, redirigiendo a login');
        router.navigate(['/login']);
        return false;
    }

    console.log('✅ AdminGuard: Usuario autenticado, acceso permitido');
    return true;
};
