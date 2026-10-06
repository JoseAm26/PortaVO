import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoService } from '../../../../services/vo.service';
import { ActivatedRoute } from '@angular/router';
import { SolicitudData } from '../../../../interfaces/formularios.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// 2. Importa los iconos requeridos
import {
  faCircleCheck,
  faUser,
  faEnvelope,
  faPhone,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-formuarlio-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, FontAwesomeModule],
  templateUrl: './formuarlio-detalle.component.html',
  styleUrl: './formuarlio-detalle.component.scss',
})
export class FormuarlioDetalleComponent {

  faCircleCheck = faCircleCheck;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faPaperPlane = faPaperPlane;

  private readonly voService = inject(VoService);
  private readonly route = inject(ActivatedRoute);
  idStock = signal('');

  constructor() {
    this.idStock.set(
      this.route.snapshot.paramMap.get('idStock') ?? ''
    );
  }

  // Signals para los campos del formulario
  nombre = signal<string>('');
  email = signal<string>('');
  telefono = signal<string>('');
  aceptaPolitica = signal<boolean>(false);

  // Signals para controlar el estado de la petición
  enviandoFormulario = signal<boolean>(false);
  mensajeFormExito = signal<boolean>(false);

  /**
   * Procesa el envío del formulario
   */
  enviarSolicitud(): void {

    if (!this.aceptaPolitica()) {
      return;
    }

    this.enviandoFormulario.set(true);

    const data: SolicitudData = {

      idioma: 'ES',

      idStk: this.idStock(),

      nombre: this.nombre(),

      eMail: this.email(),

      telefono: this.telefono()

    };

    this.voService.solicitud(data)
      .subscribe({

        next: resultado => {

          this.enviandoFormulario.set(false);

          if (resultado) {

            this.mensajeFormExito.set(true);

          }

        },

        error: err => {

          console.error(err);

          this.enviandoFormulario.set(false);

        }

      });

  }
}

