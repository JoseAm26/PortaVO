import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MenuComponent } from '../shared/menu.component/menu.component';
import { ContactoComponent } from '../shared/contacto.component/contacto.component';
import { FooterComponent } from '../shared/footer.component/footer.component';
import { VoService } from './vo/services/vo.service';
import { AnalyticsService } from './vo/services/analytics.service';
import { LoginModalService } from './vo/services/login-modal.service';
import { LoginModalComponent } from './vo/components/login-modal.component/login-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    TranslatePipe,
    MenuComponent,
    ContactoComponent,
    FooterComponent,
    LoginModalComponent,
    FontAwesomeModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  protected readonly title = signal('PotalVO');

  faWhatsapp = faWhatsapp;
  faEnvelope = faEnvelope;

  private readonly voService = inject(VoService);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly loginModalService = inject(LoginModalService);

  mostrarLogin = false;
  mostrarModalWhatsapp = false;
  toastr: any;

  ngOnInit(): void {
    this.voService.cargarUsuario().subscribe({
      next: (usuario) => console.log('Usuario cargado:', usuario),
      error: (err) => {
        console.error('Error cargando usuario:', err);
        // Mostrar notificación al usuario
        this.toastr.error('No se pudo cargar el perfil de usuario');
      },
      
    });

    this.loginModalService.mostrarModal$
      .subscribe(mostrar => {
        this.mostrarLogin = mostrar;
      });

    this.esperarConsentimientoCookies();
  }

  cerrarLogin(): void {
    this.mostrarLogin = false;
    this.loginModalService.cerrar();
  }

  abrirModalWhatsapp(): void {
    this.mostrarModalWhatsapp = true;
  }

  cerrarModalWhatsapp(): void {
    this.mostrarModalWhatsapp = false;
  }

  confirmarAperturaWhatsapp(): void {
    this.cerrarModalWhatsapp();

    const telefono = '34649730154';
    const mensaje = `Hola, estoy interesado en este vehículo ${window.location.href}`;

    window.open(
      `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`,
      '_blank'
    );
  }

  private esperarConsentimientoCookies(): void {
    const checkConsent = () => {
      const hasConsent =
        (window as any).cookieyes?.consent?.analytics === 'yes' ||
        document.cookie.includes('analytics:yes');

      if (hasConsent) {
        this.analyticsService.init();
        document.removeEventListener('cookieyesChanged', checkConsent);
      }
    };

    // Escuchar evento en lugar de hacer polling
    document.addEventListener('cookieyesChanged', checkConsent);
    // O esperar a evento específico de CookieYes
    (window as any).addEventListener('CookieYes-InitCookies', checkConsent);
  }
}
