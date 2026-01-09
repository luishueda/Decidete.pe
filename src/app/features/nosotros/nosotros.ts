import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { LucideAngularModule, SearchCheck, Flag, ScanEye } from 'lucide-angular';

@Component({
    selector: 'app-nosotros',
    standalone: true,
    imports: [CommonModule, HeroComponent, LucideAngularModule],
    templateUrl: './nosotros.html',
    styles: []
})
export class NosotrosComponent {
    // Iconos de lucide
    readonly SearchCheckIcon = SearchCheck;
    readonly FlagIcon = Flag;
    readonly ScanEyeIcon = ScanEye;

    principles = [
        {
            icon: 'SearchCheck',
            title: 'Transparencia',
            description: 'Usamos datos públicos y verificables de fuentes oficiales confiables'
        },
        {
            icon: 'Flag',
            title: 'Independencia',
            description: 'Actuamos sin afiliación partidaria ni financiamiento político'
        },
        {
            icon: 'ScanEye',
            title: 'Accesibilidad',
            description: 'Diseñamos herramientas inclusivas, visuales y fáciles de entender'
        }
    ];

    getIcon(iconName: string) {
        const icons: any = {
            'SearchCheck': this.SearchCheckIcon,
            'Flag': this.FlagIcon,
            'ScanEye': this.ScanEyeIcon
        };
        return icons[iconName];
    }
}
