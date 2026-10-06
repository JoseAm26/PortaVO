import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { VoService } from '../../services/vo.service';
import { LoginResponse, RegistraUsrData, UsrData } from '../../interfaces/login.interface';
import { TranslatePipe } from '@ngx-translate/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faBookmark, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

declare const google: any;

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    RouterLink,
    FontAwesomeModule
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent {

  faXmark = faXmark;
  faBookmark = faBookmark;
  faRightToBracket = faRightToBracket;
  faGoogle = faGoogle;

  @Output()
  cerrarModal = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private voService = inject(VoService);
  private router = inject(Router);

  cargando = false;
  error = '';

  private readonly googleClientId = '843742453385-0dhf16tronuu70d5vmfke4l97osrs7aa.apps.googleusercontent.com';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    pwd: ['', Validators.required]
  });

  cerrar(): void {
    this.cerrarModal.emit();
  }

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.error = '';

    const email = this.form.get('email')?.value ?? '';
    const pwd = this.form.get('pwd')?.value ?? '';

    const data: UsrData = {
      eMail: email,
      pwd,
      ip: '',
      nombre: '',
      id: '',
      tipoAcceso: 'VS'
    };

    this.voService.login(data).subscribe({
      next: (resp: LoginResponse) => {
        if (!resp.authenticated) {
          this.cargando = false;
          this.error = 'Usuario o contraseña incorrectos';
          return;
        }

        this.voService.cargarUsuario().subscribe({
          next: () => {
            this.cargando = false;
            this.cerrarModal.emit();
          },
          error: (err: any) => {
            console.error(err);
            this.cargando = false;
            this.error = 'Error al cargar el usuario';
          }
        });
      },
      error: (err: any) => {
        console.error(err);
        this.cargando = false;
        this.error = 'Usuario o contraseña incorrectos';
      }
    });
  }

  /**
   * Carga el SDK de Google solo al pulsar y despliega la autenticación OAuth2
   */
  async loginGoogle(): Promise<void> {
    this.cargando = true;
    this.error = '';

    try {
      // 1. Cargamos el SDK mediante tu VoService antes de invocar la librería
      await this.voService.loadGoogleSdk();

      // 2. Inicializamos el cliente de Token
      const client = google.accounts.oauth2.initTokenClient({
        client_id: this.googleClientId,
        scope: 'openid email profile',
        callback: async (response: any) => {
          // Si el usuario cancela o cierra la ventana de diálogo
          if (response.error) {
            this.cargando = false;
            if (response.error !== 'popup_closed_by_user') {
              this.error = 'Error al cancelar o autenticar con Google';
            }
            return;
          }

          try {
            if (!response.access_token) {
              this.cargando = false;
              this.error = 'No se ha podido obtener el token de Google';
              return;
            }

            const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${response.access_token}`
              }
            });

            if (!resp.ok) {
              this.cargando = false;
              this.error = 'No se han podido obtener los datos de Google';
              return;
            }

            const usuario = await resp.json();
            const nombre = usuario.name ?? '';
            const email = usuario.email ?? '';

            if (!email) {
              this.cargando = false;
              this.error = 'Google no ha devuelto el correo electrónico';
              return;
            }

            const loginData: UsrData = {
              eMail: email,
              pwd: '',
              ip: '',
              nombre,
              id: '',
              tipoAcceso: 'GOOGLE'
            };

            this.loginConGoogleEnBackend(loginData, nombre, email);

          } catch (error: any) {
            console.error('Error obteniendo datos Google', error);
            this.cargando = false;
            this.error = 'Error al iniciar sesión con Google';
          }
        }
      });

      // 3. Abrimos el modal de Google
      client.requestAccessToken();

    } catch (err) {
      console.error('Error al cargar el SDK de Google', err);
      this.cargando = false;
      this.error = 'No se pudo iniciar el servicio de autenticación de Google';
    }
  }

  private loginConGoogleEnBackend(
    loginData: UsrData,
    nombre: string,
    email: string
  ): void {
    this.voService.login(loginData).subscribe({
      next: (loginResp: LoginResponse) => {
        if (loginResp.authenticated) {
          this.cargarUsuarioYCerrarModal();
          return;
        }
        this.registrarUsuarioGoogle(loginData, nombre, email);
      },
      error: (err: any) => {
        console.warn('El usuario no existe todavía. Registrando...', err);
        this.registrarUsuarioGoogle(loginData, nombre, email);
      }
    });
  }

  private registrarUsuarioGoogle(
    loginData: UsrData,
    nombre: string,
    email: string
  ): void {
    const registroData: RegistraUsrData = {
      idioma: 'ES',
      ip: '',
      eMail: email,
      pwd: '',
      nombre,
      obs: ''
    };

    this.voService.registrarUsuarioGoogle(registroData).subscribe({
      next: (_: number) => {
        this.voService.login(loginData).subscribe({
          next: (nuevoLogin: LoginResponse) => {
            if (nuevoLogin.authenticated) {
              this.cargarUsuarioYCerrarModal();
            } else {
              this.cargando = false;
              this.error = 'No se ha podido iniciar sesión después del registro';
            }
          },
          error: (err: any) => {
            console.error(err);
            this.cargando = false;
            this.error = 'Usuario registrado, pero no se pudo iniciar sesión';
          }
        });
      },
      error: (err: any) => {
        console.error(err);
        this.cargando = false;
        this.error = 'No se ha podido registrar el usuario con Google';
      }
    });
  }

  private cargarUsuarioYCerrarModal(): void {
    this.voService.cargarUsuario().subscribe({
      next: () => {
        const returnUrl = sessionStorage.getItem('returnUrl');
        sessionStorage.removeItem('returnUrl');

        this.cargando = false;
        this.cerrarModal.emit();

        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        }
      },
      error: (err: any) => {
        console.error(err);
        this.cargando = false;
        this.error = 'Error al cargar el usuario';
      }
    });
  }

  navegarYCerrar(ruta: string): void {
    this.cerrar();
    this.router.navigate([ruta]);
  }
}
