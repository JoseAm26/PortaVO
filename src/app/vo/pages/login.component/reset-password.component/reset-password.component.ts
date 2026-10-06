import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { VoService } from '../../../services/vo.service';
import { ResetPwdData } from '../../../interfaces/login.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// 2. Importa los iconos necesarios
import {
  faLock,
  faCircleNotch,
  faCircleXmark,
  faCircleCheck,
  faRightToBracket,
  faCircleExclamation,
  faTriangleExclamation,
  faFloppyDisk
} from '@fortawesome/free-solid-svg-icons';

// Validador personalizado a nivel de FormGroup para comparar las contraseñas
export const coincidenPasswordsValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('nuevaPassword');
  const confirmarPassword = control.get('confirmarPassword');

  if (!password || !confirmarPassword) {
    return null;
  }

  // Si no coinciden, marcamos el error en el control de confirmación
  if (password.value !== confirmarPassword.value) {
    confirmarPassword.setErrors({ ...confirmarPassword.errors, noCoinciden: true });
    return { noCoinciden: true };
  }

  // Si coinciden y tenía el error previamente, lo eliminamos sin borrar otros errores (como required)
  if (confirmarPassword.hasError('noCoinciden')) {
    const { noCoinciden, ...restErrors } = confirmarPassword.errors || {};
    confirmarPassword.setErrors(Object.keys(restErrors).length ? restErrors : null);
  }

  return null;
};

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [TranslatePipe, CommonModule, ReactiveFormsModule, RouterLink, FontAwesomeModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export default class ResetPasswordComponent implements OnInit {

  faLock = faLock;
  faCircleNotch = faCircleNotch;
  faCircleXmark = faCircleXmark;
  faCircleCheck = faCircleCheck;
  faRightToBracket = faRightToBracket;
  faCircleExclamation = faCircleExclamation;
  faTriangleExclamation = faTriangleExclamation;
  faFloppyDisk = faFloppyDisk;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly voService = inject(VoService);

  // Estados reactivos con Signals
  cargandoValidacion = signal<boolean>(true);
  tokenValido = signal<boolean>(false);
  cargandoEnvio = signal<boolean>(false);
  exito = signal<boolean>(false);

  mensajeEstado = signal<string>('Validando el enlace...');
  errorServidor = signal<string | null>(null);

  token = signal<string>('');
  mail = signal<string>('');

  // Formulario reactivo
  form: FormGroup = this.fb.group(
    {
      nuevaPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]],
    },
    { validators: coincidenPasswordsValidator }
  );

  ngOnInit(): void {
    const tokenUrl = this.route.snapshot.paramMap.get('token');

    if (!tokenUrl) {
      this.cargandoValidacion.set(false);
      this.tokenValido.set(false);
      this.mensajeEstado.set('El enlace para restablecer la contraseña no es válido.');
      return;
    }

    this.token.set(tokenUrl);

    // 1. Validar token y recuperar el email correspondiente
    this.voService
      .comporbarToken(tokenUrl)
      .pipe(
        finalize(() => this.cargandoValidacion.set(false))
      )
      .subscribe({
        next: (mailResultado) => {
          if (mailResultado) {
            this.tokenValido.set(true);
            this.mail.set(mailResultado);
          } else {
            this.tokenValido.set(false);
            this.mensajeEstado.set('El enlace ha expirado o ya ha sido utilizado.');
          }
        },
        error: (err) => {
          console.error('Error al comprobar token:', err);
          this.tokenValido.set(false);
          this.mensajeEstado.set('El enlace ha expirado o no es válido.');
        },
      });
  }

  // 2. Enviar la nueva contraseña al servicio resetPwd
  guardarPassword(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargandoEnvio.set(true);
    this.errorServidor.set(null);

    const payload: ResetPwdData = {
      mail: this.mail(),
      nuevaPassword: this.form.get('nuevaPassword')?.value,
      token: this.token(),
    };

    this.voService
      .resetPwd(payload)
      .pipe(
        finalize(() => this.cargandoEnvio.set(false))
      )
      .subscribe({
        next: (resultado: boolean) => {
          if (resultado) {
            this.exito.set(true);
          } else {
            this.errorServidor.set('No se ha podido cambiar la contraseña. Inténtalo de nuevo.');
          }
        },
        error: (err) => {
          console.error('Error al cambiar contraseña:', err);
          this.errorServidor.set('Ocurrió un error en el servidor al intentar cambiar la contraseña.');
        },
      });
  }

  // 3. Navegación manual tras éxito
  irAlLogin(): void {
    this.router.navigate(['/login']);
  }
}
