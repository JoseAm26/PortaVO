import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VoService } from '../../../services/vo.service';
import { RegistraUsrData } from '../../../interfaces/login.interface';
import { TranslatePipe } from '@ngx-translate/core';

function passwordsIguales(
  control: AbstractControl
): ValidationErrors | null {

  const pwd = control.get('password')?.value;
  const pwd2 = control.get('passwordConfirm')?.value;

  return pwd === pwd2
    ? null
    : { passwordNoCoincide: true };

}

@Component({
  selector: 'app-registrar.component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.scss'
})
export default class RegistrarComponent {

  private readonly fb = inject(FormBuilder);
  private readonly voService = inject(VoService);

  enviando = signal(false);
  registroOk = signal(false);
  mensajeError = signal('');

  formulario = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    nombre: ['', Validators.required],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9!?-]{8,12}$/)
      ]
    ],
    passwordConfirm: ['', Validators.required],
    telefono: [''],
    aceptaEnvio: [false],
    terminos: [false, Validators.requiredTrue]
  }, {
    validators: passwordsIguales
  });

  registrar(): void {

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();

      return;

    }

    this.enviando.set(true);

    const form = this.formulario.getRawValue();

    const data: RegistraUsrData = {
      idioma: 'ES',
      ip: '',
      eMail: form.email ?? '',
      pwd: form.password ?? '',
      aceptaEnvio: form.aceptaEnvio ? 'S' : 'N',
      nombre: form.nombre ?? '',
      tfn: form.telefono ?? '',
      provincia: '',
      obs: ''
    };

    this.voService.registrarUsuario(data).subscribe({
        next: resultado => {
          this.enviando.set(false);

          if (resultado > 0) {
            this.registroOk.set(true);
          } else {
            this.mensajeError.set('No ha sido posible completar el registro.');
          }

        },

        error: err => {

          console.error(err);
          this.enviando.set(false);
          this.mensajeError.set('Ha ocurrido un error al registrar el usuario.');

        }

      });

  }

  // Helper para verificar si un campo es inválido y ha sido tocado
  esCampoInvalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

}
