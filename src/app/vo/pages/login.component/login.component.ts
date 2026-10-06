import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DestacadasComponent } from '../../components/destacadas.component/destacadas.component';
import { VoService } from '../../services/vo.service';
import { LoginResponse, RegistraUsrData, UsrData } from '../../interfaces/login.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faArrowRight,
  faStar,
  faBell,
  faCodeCompare,
  faBookOpen,
  faUserPlus,
  faShieldHalved,
  faWrench,
  faTruckMedical,
  faCoins
} from '@fortawesome/free-solid-svg-icons';

declare const google: any;

@Component({
  selector: 'app-login.component',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    DestacadasComponent, TranslatePipe, FontAwesomeModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent {

  faArrowRight = faArrowRight;
  faStar = faStar;
  faBell = faBell;
  faCodeCompare = faCodeCompare;
  faBookOpen = faBookOpen;
  faUserPlus = faUserPlus;
  faShieldHalved = faShieldHalved;
  faWrench = faWrench;
  faTruckMedical = faTruckMedical;
  faCoins = faCoins;

  private readonly fb = inject(FormBuilder);
  private readonly voService = inject(VoService);
  private readonly router = inject(Router);

  loading = false;
  error = '';

  usuarioGoogle = signal<any>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    pwd: ['', Validators.required]
  });

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const data: UsrData = {
      eMail: this.form.value.email!,
      pwd: this.form.value.pwd!,
      ip: '',
      nombre: '',
      id: '',
      tipoAcceso: 'VS'
    };

    this.voService.login(data).subscribe({
      next: () => {
        this.loading = false;
        this.voService.cargarUsuario().subscribe(() => {
          this.router.navigate(['/home']);
        });
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al hacer login';
      }
    });
  }

  get email() {
    return this.form.controls.email;
  }

  get pwd() {
    return this.form.controls.pwd;
  }

  /**
   * Carga perezosa del SDK de Google en el clic del usuario y despliega la ventana OAuth.
   */
  async loginGoogle(): Promise<void> {
    try {
      this.loading = true;
      await this.voService.loadGoogleSdk();

      const client = google.accounts.oauth2.initTokenClient({
        client_id: '843742453385-0dhf16tronuu70d5vmfke4l97osrs7aa.apps.googleusercontent.com',
        scope: 'openid email profile',
        callback: async (response: any) => {
          if (response.error) {
            this.loading = false;
            console.error('Error de autenticación Google:', response);
            return;
          }

          try {
            const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${response.access_token}`
              }
            });

            const usuario = await resp.json();
            const nombre = usuario.name;
            const email = usuario.email;

            const loginData: UsrData = {
              eMail: email,
              pwd: '',
              ip: '',
              nombre,
              id: '',
              tipoAcceso: 'GOOGLE'
            };

            this.voService.login(loginData).subscribe({
              next: (loginResp: LoginResponse) => {
                if (loginResp.authenticated) {
                  this.voService.cargarUsuario().subscribe(() => {
                    this.loading = false;
                    this.router.navigate(['/home']);
                  });
                  return;
                }

                const registroData: RegistraUsrData = {
                  idioma: 'ES',
                  ip: '',
                  eMail: email,
                  pwd: '',
                  nombre,
                  obs: ''
                };

                this.voService.registrarUsuarioGoogle(registroData).subscribe({
                  next: () => {
                    this.voService.login(loginData).subscribe({
                      next: (nuevoLogin: LoginResponse) => {
                        if (nuevoLogin.authenticated) {
                          this.voService.cargarUsuario().subscribe(() => {
                            this.loading = false;
                            this.router.navigate(['/home']);
                          });
                        }
                      },
                      error: (err: any) => {
                        this.loading = false;
                        console.error(err);
                      }
                    });
                  },
                  error: (err: any) => {
                    this.loading = false;
                    console.error(err);
                  }
                });
              },
              error: (err: any) => {
                this.loading = false;
                console.error(err);
              }
            });
          } catch (error) {
            this.loading = false;
            console.error('Error obteniendo datos de Google:', error);
          }
        }
      });

      client.requestAccessToken();
    } catch (err) {
      this.loading = false;
      console.error('No se pudo inicializar Google OAuth:', err);
    }
  }
}
