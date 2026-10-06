import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VoService } from '../../app/vo/services/vo.service';
import { LlamarData } from '../../app/vo/interfaces/formularios.interface';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'shared-contacto',
  standalone: true,
  imports: [
    CommonModule, TranslatePipe, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatCheckboxModule, MatSnackBarModule, RouterLink
  ],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent {

  private readonly fb = inject(FormBuilder);
  private readonly voService = inject(VoService);
  private readonly snackBar = inject(MatSnackBar);

  formulario = this.fb.group({
    nombre: ['', Validators.required],
    telefono: ['', Validators.required],
    privacidad: [false, Validators.requiredTrue]
  });

  enviar(): void {

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const form = this.formulario.getRawValue();

    const data: LlamarData = {
      nombre: form.nombre ?? '',
      telefono: form.telefono ?? '',
      eMail: '',
      texto: ''
    };

    this.voService.teLlamamos(data)
      .subscribe({
        next: resultado => {
          if (resultado) {
            this.mostrarExito();
            this.formulario.reset();
            this.formulario.patchValue({
              privacidad: false
            });
          } else {
            this.mostrarError();
          }
        },
        error: err => {
          console.error(err);
          alert(
            'Ha ocurrido un error al enviar la solicitud.'
          );
        }
      });

  }

  private mostrarExito(): void {

    this.snackBar.open(
      'Solicitud enviada correctamente. Nos pondremos en contacto contigo lo antes posible.',
      '',
      {
        duration: 6000,
        panelClass: ['snackbar-ok'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    );

  }

  private mostrarError(): void {

    this.snackBar.open(
      'No ha sido posible enviar la solicitud. Inténtalo de nuevo.',
      '',
      {
        duration: 6000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    );

  }

}
