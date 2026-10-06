import { Component, inject, computed, signal, OnInit, effect, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

// 1. Importa FontAwesomeModule
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// 2. Importa los iconos necesarios
import {
  faCodeCompare,
  faTruckFront,
  faXmark,
  faEye,
  faTruck,
  faGears,
  faWeightHanging,
  faTruckPickup,
  faCouch,
  faBoxesStacked,
  faTrashCan,
  faCircleXmark,
  faCircleCheck
} from '@fortawesome/free-solid-svg-icons';

import { ComparadorService } from '../../services/comparador.service';
import { VoService } from '../../services/vo.service';
import { IdiomaService } from '../../services/idioma.service';
import { FichaDto } from '../../interfaces/detalles.interface';
import { ImagenesVehDto } from '../../interfaces/imagenes.interface';

export interface VehiculoComparadorDto extends FichaDto {
  imagenPrincipal?: string | null;
}

@Component({
  selector: 'app-comparador',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslatePipe,
    FontAwesomeModule // 3. Registra FontAwesomeModule
  ],
  templateUrl: './comparador.component.html',
  styleUrl: './comparador.component.scss'
})
export default class ComparadorComponent implements OnInit {
  private comparadorService = inject(ComparadorService);
  private voService = inject(VoService);
  private idiomaService = inject(IdiomaService);
  private sanitizer = inject(DomSanitizer);
  private destroyRef = inject(DestroyRef);

  // 4. Asigna los iconos a propiedades del componente
  faCodeCompare = faCodeCompare;
  faTruckFront = faTruckFront;
  faXmark = faXmark;
  faEye = faEye;
  faTruck = faTruck;
  faGears = faGears;
  faWeightHanging = faWeightHanging;
  faTruckPickup = faTruckPickup;
  faCouch = faCouch;
  faBoxesStacked = faBoxesStacked;
  faTrashCan = faTrashCan;
  faCircleXmark = faCircleXmark;
  faCircleCheck = faCircleCheck;

  vehiculosDetalle = signal<VehiculoComparadorDto[]>([]);
  cargando = signal<boolean>(false);
  vehiculoActivoIndex = signal<number>(0);

  private idioma$ = toObservable(this.idiomaService.idioma);

  constructor() {
    effect(() => {
      const idsComparador = this.comparadorService.vehiculosComparador();
      this.vehiculosDetalle.update(lista =>
        lista.filter(v => idsComparador.includes(v.idStoc.toString()))
      );
    });
  }

  ngOnInit(): void {
    this.idioma$
      .pipe(
        switchMap(idiomaObj => {
          const idiomaCodigo = idiomaObj.codigo.toLowerCase();
          return this.cargarDatosComparadorObs(idiomaCodigo);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({ fichas, imagenesDto }) => {
          const resultado: VehiculoComparadorDto[] = fichas.map((ficha, index) => {
            let img: string | null = null;

            if (imagenesDto) {
              const listaImg = (imagenesDto as any).imagenes || (imagenesDto as any).data || (Array.isArray(imagenesDto) ? imagenesDto : null);
              if (Array.isArray(listaImg) && listaImg[index]) {
                img = listaImg[index];
              } else if (typeof imagenesDto === 'object' && (imagenesDto as any)[ficha.idStoc]) {
                img = (imagenesDto as any)[ficha.idStoc];
              }
            }

            if (!img && ficha.img1) {
              img = ficha.img1;
            }

            return {
              ...ficha,
              imagenPrincipal: img
            };
          });

          this.vehiculosDetalle.set(resultado);
          this.cargando.set(false);
        },
        error: (err) => {
          console.error('Error general en el comparador:', err);
          this.cargando.set(false);
        }
      });
  }

  vehiculos = computed(() => this.vehiculosDetalle());

  quitarVehiculo(idStoc: string): void {
    this.comparadorService.removeVehiculo(idStoc);
  }

  formatearNumero(valor: number | string | null | undefined, sufijo = ''): string | null {
    if (
      valor === null ||
      valor === undefined ||
      valor === '' ||
      valor === 0 ||
      valor === '0'
    ) {
      return null;
    }

    const numero = Number(valor);

    if (isNaN(numero)) {
      return `${valor}${sufijo}`;
    }

    const localeMap: Record<string, string> = {
      'ES': 'es-ES',
      'EN': 'en-US',
      'FR': 'fr-FR'
    };

    const locale = localeMap[this.idiomaService.getCodigo()] || 'es-ES';
    return `${numero.toLocaleString(locale)}${sufijo}`;
  }

  esRigido(v: FichaDto): boolean {
    const tipo = `${v.tipoVeh ?? ''} ${v.vhTipVeh ?? ''}`.toLowerCase();
    return tipo.includes('rigido') || tipo.includes('rígido');
  }

  private cargarDatosComparadorObs(idioma: string) {
    const idsComparador = this.comparadorService.vehiculosComparador();

    if (!idsComparador || idsComparador.length === 0) {
      this.vehiculosDetalle.set([]);
      this.cargando.set(false);
      return of({ fichas: [], imagenesDto: null });
    }

    this.cargando.set(true);

    const peticionesFichas = idsComparador.map(id =>
      this.voService.getFicha({ aIdioma: idioma, aIdStock: id }).pipe(
        catchError(err => {
          console.error(`Error al obtener ficha de idStock ${id}:`, err);
          return of(null);
        })
      )
    );

    return forkJoin(peticionesFichas).pipe(
      switchMap((fichas) => {
        const fichasValidas = fichas.filter((f): f is FichaDto => f !== null);

        if (fichasValidas.length === 0) {
          return of({ fichas: [], imagenesDto: null });
        }

        return this.voService.getImagenes(idsComparador, 0).pipe(
          switchMap((resImagenes: ImagenesVehDto) => {
            return of({ fichas: fichasValidas, imagenesDto: resImagenes });
          }),
          catchError((err) => {
            console.error('Error al recuperar imágenes:', err);
            return of({ fichas: fichasValidas, imagenesDto: null });
          })
        );
      })
    );
  }

  renderValor(valor: any): SafeHtml {
    if (
      valor === null ||
      valor === undefined ||
      valor === '' ||
      valor === '0' ||
      valor === 0 ||
      valor === 'false' ||
      valor === false ||
      valor === 'N' ||
      valor === 'NO' ||
      valor === 'No'
    ) {
      // Genera el HTML dinámico compatible con SVG de FontAwesome o clases estándar
      return this.sanitizer.bypassSecurityTrustHtml(
        `<svg class="svg-inline--fa fa-circle-xmark text-danger fs-6" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="${faCircleXmark.icon[4]}"></path></svg>`
      );
    }

    if (
      valor === true ||
      valor === 'true' ||
      valor === 'S' ||
      valor === 'SI' ||
      valor === 'Si' ||
      valor === 'Sí'
    ) {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<svg class="svg-inline--fa fa-circle-check text-success fs-6" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="${faCircleCheck.icon[4]}"></path></svg>`
      );
    }

    return this.sanitizer.bypassSecurityTrustHtml(String(valor));
  }

  seleccionarVehiculoIndex(index: number) {
    this.vehiculoActivoIndex.set(index);
    if (this.vehiculoActivoIndex() >= this.vehiculos().length) {
      this.vehiculoActivoIndex.set(Math.max(0, this.vehiculos().length - 1));
    }
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }
}
