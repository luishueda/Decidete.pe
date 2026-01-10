from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Crea un superusuario si no existe'

    def handle(self, *args, **options):
        User = get_user_model()
        
        # Credenciales del superusuario
        username = 'admin'
        email = 'admin@decidete.pe'
        password = 'decidete2026'  # Cambiar después del primer login
        
        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(self.style.SUCCESS(f'Superusuario "{username}" creado exitosamente'))
            self.stdout.write(self.style.WARNING(f'Email: {email}'))
            self.stdout.write(self.style.WARNING(f'Password: {password}'))
            self.stdout.write(self.style.WARNING('IMPORTANTE: Cambia la contraseña después del primer login'))
        else:
            self.stdout.write(self.style.WARNING(f'El superusuario "{username}" ya existe'))
