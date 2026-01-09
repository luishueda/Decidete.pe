import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.html',
    styles: []
})
export class LoginComponent {
    isLogin = true;
    formData = {
        email: '',
        password: '',
        nombre: '',
        confirmPassword: ''
    };

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    handleSubmit() {
        if (this.isLogin) {
            // Login
            this.authService.loginUsuario({
                email: this.formData.email,
                password: this.formData.password
            }).subscribe({
                next: (data) => {
                    // Guardar usuario en localStorage
                    this.authService.guardarUsuario({
                        id: data.id_usuario,
                        nombre: data.nombre,
                        email: data.email
                    });

                    alert(`¡Bienvenido, ${data.nombre}!`);

                    // Recargar automáticamente para que navbar se actualice
                    window.location.href = '/';
                },
                error: (error) => {
                    console.error('Error login:', error);
                    alert(error.error?.error || 'Error al iniciar sesión');
                }
            });

        } else {
            // Registro
            if (this.formData.password !== this.formData.confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }

            this.authService.registrarUsuario({
                nombre: this.formData.nombre,
                email: this.formData.email,
                password: this.formData.password
            }).subscribe({
                next: (data) => {
                    alert('¡Cuenta creada con éxito! Ahora inicia sesión.');
                    this.isLogin = true;
                    // Limpiar formulario
                    this.formData = {
                        email: this.formData.email,
                        password: '',
                        nombre: '',
                        confirmPassword: ''
                    };
                },
                error: (error) => {
                    console.error('Error registro:', error);
                    alert(error.error?.error || 'Error al registrarse');
                }
            });
        }
    }

    toggleMode() {
        this.isLogin = !this.isLogin;
        // Limpiar contraseñas al cambiar de modo
        this.formData.password = '';
        this.formData.confirmPassword = '';
    }

    continueAsGuest() {
        localStorage.removeItem('usuario_decide_pe');
        this.router.navigate(['/']);
    }
}
