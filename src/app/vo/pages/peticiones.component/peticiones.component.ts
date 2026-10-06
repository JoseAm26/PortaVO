import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { VoService } from '../../services/vo.service';
import { IdiomaService } from '../../services/idioma.service';
import { FiltroDto } from '../../interfaces/filtro.interface';
import { PeticionData } from '../../interfaces/peticion.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// 2. Importa los iconos necesarios
import {
  faSpinner,
  faTruckFront,
  faCheck,
  faTag,
  faList,
  faCircleInfo,
  faTruckRampBox,
  faCircleCheck,
  faTriangleExclamation,
  faRotateLeft
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-peticiones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, FontAwesomeModule],
  templateUrl: './peticiones.component.html',
  styleUrl: './peticiones.component.scss',
})
export default class PeticionesComponent implements OnInit {

  faSpinner = faSpinner;
  faTruckFront = faTruckFront;
  faCheck = faCheck;
  faTag = faTag;
  faList = faList;
  faCircleInfo = faCircleInfo;
  faTruckRampBox = faTruckRampBox;
  faCircleCheck = faCircleCheck;
  faTriangleExclamation = faTriangleExclamation;
  faRotateLeft = faRotateLeft;
  // faPaperPlane = faPaperPlane;

  private fb = inject(FormBuilder);
  private voService = inject(VoService);
  private idiomaService = inject(IdiomaService);
  private translateService = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  filtros = signal<FiltroDto | null>(null);
  cargandoFiltros = signal<boolean>(true);
  enviando = signal<boolean>(false);
  mensajeExito = signal<string | null>(null);
  mensajeError = signal<string | null>(null);

  peticionForm!: FormGroup;

  private idioma$ = toObservable(this.idiomaService.idioma);

  /**
   * Relación manual Marca -> Modelos.
   * Esto es necesario porque tu API ahora mismo devuelve marcas y modelos en arrays separados.
   */
  marcasModelos: Record<string, string[]> = {
    VOLVO: [
      'FH4',
      'FH4 I-SAVE',
      'FH5 I-SAVE',
      'FH 420',
      'FH 13 540',
      'FM11',
      'FL 18 250'
    ],
    DAF: [
      'FT XF 105460',
      'FA CF 75.310',
      'FT 95XF530',
      'XF 480',
      'FT CF 85 430'
    ],
    IVECO: [
      'AS440S46',
      'AS440S48T/P',
      'AS440T/P'
    ],
    'KRONE TRAILER': [
      'DA04CLNF'
    ],
    SCANIA: [],
    RENAULT: [],
    MERCEDES: [],
    MAN: [],
    FORD: []
  };

  ngOnInit(): void {
    this.initForm();

    this.idioma$
      .pipe(
        switchMap(() => {
          this.cargandoFiltros.set(true);
          return this.voService.getFiltros();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data) => {
          this.filtros.set(data);
          this.cargandoFiltros.set(false);
        },
        error: (err) => {
          console.error('Error al cargar filtros:', err);
          this.mensajeError.set(
            this.translateService.instant('PETICIONES.MENSAJES.ERROR_CARGA_FILTROS')
          );
          this.cargandoFiltros.set(false);
        }
      });
  }

  private initForm(): void {
    this.peticionForm = this.fb.group({
      tipoVehiculo: [[], Validators.required],
      marca: [[]],
      modelo: [[]],
      carroceria: [[]],
    });
  }

  toggleCheckbox(controlName: string, value: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const control = this.peticionForm.get(controlName);

    if (!control) return;

    const valoresActuales: string[] = control.value ?? [];

    if (input.checked) {
      control.setValue([...valoresActuales, value]);
    } else {
      control.setValue(valoresActuales.filter(item => item !== value));
    }

    control.markAsTouched();
    control.updateValueAndValidity();

    this.aplicarDependencias(controlName);
  }

  private aplicarDependencias(controlName: string): void {
    if (controlName === 'tipoVehiculo') {
      const tiposSeleccionados = this.peticionForm.get('tipoVehiculo')?.value ?? [];

      if (tiposSeleccionados.length === 0) {
        this.peticionForm.patchValue({
          marca: [],
          modelo: [],
          carroceria: []
        });
      }
    }

    if (controlName === 'marca') {
      this.limpiarModelosNoDisponibles();

      const marcasSeleccionadas = this.peticionForm.get('marca')?.value ?? [];

      if (marcasSeleccionadas.length === 0) {
        this.peticionForm.patchValue({
          modelo: [],
          carroceria: []
        });
      }
    }

    if (controlName === 'modelo') {
      const modelosSeleccionados = this.peticionForm.get('modelo')?.value ?? [];

      if (modelosSeleccionados.length === 0) {
        this.peticionForm.patchValue({
          carroceria: []
        });
      }
    }
  }

  private limpiarModelosNoDisponibles(): void {
    const modelosSeleccionados: string[] = this.peticionForm.get('modelo')?.value ?? [];
    const modelosPermitidos = this.modelosFiltrados;

    const modelosValidos = modelosSeleccionados.filter(modelo =>
      modelosPermitidos.includes(modelo)
    );

    this.peticionForm.patchValue({
      modelo: modelosValidos
    });

    if (modelosValidos.length === 0) {
      this.peticionForm.patchValue({
        carroceria: []
      });
    }
  }

  estaSeleccionado(controlName: string, value: string): boolean {
    const valores: string[] = this.peticionForm.get(controlName)?.value ?? [];
    return valores.includes(value);
  }

  get tiposSeleccionados(): string[] {
    return this.peticionForm.get('tipoVehiculo')?.value ?? [];
  }

  get marcasSeleccionadas(): string[] {
    return this.peticionForm.get('marca')?.value ?? [];
  }

  get modelosSeleccionados(): string[] {
    return this.peticionForm.get('modelo')?.value ?? [];
  }

  get carroceriasSeleccionadas(): string[] {
    return this.peticionForm.get('carroceria')?.value ?? [];
  }

  get hayTipoSeleccionado(): boolean {
    return this.tiposSeleccionados.length > 0;
  }

  get hayMarcaSeleccionada(): boolean {
    return this.marcasSeleccionadas.length > 0;
  }

  get hayModeloSeleccionado(): boolean {
    const modelos = this.peticionForm.get('modelo')?.value ?? [];
    return modelos.length > 0;
  }

  get modelosFiltrados(): string[] {
    if (!this.marcasSeleccionadas.length) {
      return [];
    }

    const modelos = this.marcasSeleccionadas.flatMap(marca =>
      this.marcasModelos[marca] ?? []
    );

    return [...new Set(modelos)].sort((a, b) => a.localeCompare(b));
  }

  limpiarFormulario(): void {
    this.peticionForm.reset({
      tipoVehiculo: [],
      marca: [],
      modelo: [],
      carroceria: [],
    });

    this.mensajeExito.set(null);
    this.mensajeError.set(null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  onSubmit(): void {
    if (this.peticionForm.invalid) {
      this.peticionForm.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.mensajeExito.set(null);
    this.mensajeError.set(null);

    const idUsuario = this.voService.usuarioActual?.numUsuario ?? 0;

    const data: PeticionData = {
      id: 0,
      idUsr: idUsuario,
      tipoVehiculo: this.tiposSeleccionados.join(', '),
      marca: this.marcasSeleccionadas.join(', '),
      modelo: this.modelosSeleccionados.join(', '),
      carroceria: this.carroceriasSeleccionadas.join(', ')
    };

    this.voService.eviarPeticion(data).subscribe({
      next: (res) => {
        this.enviando.set(false);

        if (res) {
          this.mensajeExito.set(
            this.translateService.instant('PETICIONES.MENSAJES.EXITO_ENVIO')
          );

          this.peticionForm.reset({
            tipoVehiculo: [],
            marca: [],
            modelo: [],
            carroceria: [],
          });

          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });

        } else {
          this.mensajeError.set(
            this.translateService.instant('PETICIONES.MENSAJES.ERROR_PROCESAR')
          );
        }
      },
      error: (err) => {
        console.error('Error al enviar petición:', err);
        this.enviando.set(false);
        this.mensajeError.set(
          this.translateService.instant('PETICIONES.MENSAJES.ERROR_ENVIO')
        );
      }
    });
  }
}
