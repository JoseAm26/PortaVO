import { Component, inject, DestroyRef, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { VoService } from '../../../services/vo.service';
import { IdiomaService } from '../../../services/idioma.service';
import { PwdForgotData } from '../../../interfaces/login.interface';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// 2. Importa los iconos necesarios
import {
  faKey,
  faPaperPlane,
  faClock,
  faArrowLeft,
  faCircleExclamation,
  faTriangleExclamation,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe, FontAwesomeModule],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss',
})
export default class PasswordComponent implements OnInit {

  faKey = faKey;
  faPaperPlane = faPaperPlane;
  faClock = faClock;
  faArrowLeft = faArrowLeft;
  faCircleExclamation = faCircleExclamation;
  faTriangleExclamation = faTriangleExclamation;
  faEnvelope = faEnvelope;

  private readonly fb = inject(FormBuilder);
  private readonly voService = inject(VoService);
  private readonly idiomaService = inject(IdiomaService);
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // Signals de estado
  cargando = signal<boolean>(false);
  exito = signal<boolean>(false);
  error = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private idioma$ = toObservable(this.idiomaService.idioma);

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
    });
  }

  ngOnInit(): void {
    // Si cambia el idioma y hay un mensaje de error activo, re-traducimos dinámicamente
    this.idioma$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.error()) {
          this.error.set(this.translateService.instant('PASSWORD.ERRORES.ERROR_PROCESO'));
        }
      });
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    const email = this.form.get('email')?.value;

    const data: PwdForgotData = {
      eMail: email,
    };

    this.voService
      .pwdForgot(data)
      .pipe(
        finalize(() => {
          this.cargando.set(false);
        })
      )
      .subscribe({
        next: (resultado: boolean) => {
          if (resultado) {
            this.exito.set(true);

            // Redirección tras 3 segundos
            this.timeoutId = setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          } else {
            this.error.set(this.translateService.instant('PASSWORD.ERRORES.ENVIO_FALLIDO'));
          }
        },
        error: (err) => {
          console.error(err);
          this.error.set(this.translateService.instant('PASSWORD.ERRORES.ERROR_PROCESO'));
        },
      });
  }
}
