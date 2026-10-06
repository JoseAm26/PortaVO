import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { VoService } from '../../app/vo/services/vo.service';
import { LoginModalComponent } from '../../app/vo/components/login-modal.component/login-modal.component';
import { IdiomaService, Idioma } from '../../app/vo/services/idioma.service'; // Ajusta la ruta del servicio según tu estructura
import { TranslatePipe } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// 2. Importa los iconos necesarios
import {
  faPhone,
  faRightFromBracket,
  faChevronDown,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'shared-menu',
  imports: [
    RouterLink, RouterLinkActive, AsyncPipe,
    LoginModalComponent, TranslatePipe, FontAwesomeModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {

  faPhone = faPhone;
  faRightFromBracket = faRightFromBracket;
  faChevronDown = faChevronDown;
  faCheck = faCheck;

  private readonly voService = inject(VoService);
  private readonly router = inject(Router);

  // Inyectado como 'public' para poder ser leído directamente en el HTML
  public readonly idiomaService = inject(IdiomaService);

  mostrarLoginModal = false;
  rutaPendiente: string | null = null;
  usuario$ = this.voService.usuario$;
  menuAbierto = false;

  // Lista de idiomas tipada según la interfaz del IdiomaService
  idiomas: Idioma[] = [
    { codigo: 'ES', nombre: 'Español' },
    { codigo: 'EN', nombre: 'English' },
    { codigo: 'FR', nombre: 'Français' }
  ];

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  // Delegamos el cambio de idioma al servicio de Angular Signals
  cambiarIdioma(idioma: Idioma): void {
    this.idiomaService.cambiarIdioma(idioma);
  }

  cerrarSesion(): void {
    this.voService.logout().subscribe({
      next: () => {
        this.router.navigate(['/home']);
      }
    });
  }

  irRutaProtegida(ruta: string): void {
    if (this.voService.usuarioActual) {
      this.router.navigate([ruta]);
      this.cerrarMenu();
      return;
    }

    this.rutaPendiente = ruta;
    this.mostrarLoginModal = true;
  }

  cerrarLoginModal(): void {
    this.mostrarLoginModal = false;

    if (this.voService.usuarioActual && this.rutaPendiente) {
      this.router.navigate([this.rutaPendiente]);
      this.rutaPendiente = null;
    }
  }
}
