import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { VoService } from '../../services/vo.service';
import { IdiomaService } from '../../services/idioma.service';
import { BusquedaDto } from '../../interfaces/busqueda.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// 2. Importa los iconos necesarios
import {
  faPlus,
  faCircleInfo,
  faBookmark,
  faTrashCan,
  faMagnifyingGlass,
  faRoad,
  faCalendar,
  faGaugeHigh,
  faTag
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-busquedas',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, FontAwesomeModule],
  templateUrl: './busquedas.component.html',
  styleUrl: './busquedas.component.scss'
})
export default class BusquedasComponent implements OnInit {

  faPlus = faPlus;
  faCircleInfo = faCircleInfo;
  faBookmark = faBookmark;
  faTrashCan = faTrashCan;
  faMagnifyingGlass = faMagnifyingGlass;
  faRoad = faRoad;
  faCalendar = faCalendar;
  faGaugeHigh = faGaugeHigh;
  faTag = faTag;

  private readonly voService = inject(VoService);
  private readonly idiomaService = inject(IdiomaService);
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly cargando = signal(true);
  readonly busquedas = signal<BusquedaDto[]>([]);

  // Flujo reactivo del idioma en el contexto de inyección
  private idioma$ = toObservable(this.idiomaService.idioma);

  ngOnInit(): void {
    // Reacciona automáticamente a cambios de idioma
    this.idioma$
      .pipe(
        switchMap(() => {
          const usuario = this.voService.usuarioActual;
          if (!usuario) {
            return of([]);
          }
          this.cargando.set(true);
          return this.voService.getBusquedas(usuario.numUsuario.toString());
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: busquedas => {
          this.busquedas.set(busquedas || []);
          this.cargando.set(false);
        },
        error: err => {
          console.error('Error al cargar búsquedas:', err);
          this.busquedas.set([]);
          this.cargando.set(false);
        }
      });
  }

  eliminarBusqueda(busqueda: BusquedaDto): void {
    const usuario = this.voService.usuarioActual;
    if (!usuario) return;

    const idBusq = busqueda.numBusqueda;
    if (!idBusq) return;

    const busquedasAntes = this.busquedas();

    this.busquedas.update(lista =>
      lista.filter(x => x.numBusqueda !== idBusq)
    );

    this.voService.delBusqueda({ idUsr: usuario.numUsuario.toString(), idBusq }).subscribe({
      next: resultado => {
        if (resultado === false) {
          this.busquedas.set(busquedasAntes);
        }
      },
      error: (err: any) => {
        console.error('Error al eliminar búsqueda:', err);
        this.busquedas.set(busquedasAntes);
      }
    });
  }

  getRango(desde?: string, hasta?: string, sufijo = ''): string {
    if (!desde && !hasta) {
      return this.translateService.instant('BUSQUEDAS.RANGOS.SIN_LIMITE');
    }

    return `${desde || '0'} - ${hasta || '∞'}${sufijo}`;
  }

  verVehiculos(busqueda: BusquedaDto): void {
    this.router.navigate(['/buscador'], {
      queryParams: {
        marcas: busqueda.marcas?.join('|') || null,
        modelos: busqueda.modelos?.join('|') || null,
        tipos: busqueda.tipos?.join('|') || null,
        anioDesde: busqueda.anioDesde || null,
        anioHasta: busqueda.anioHasta || null,
        kmsDesde: busqueda.kmsDesde || null,
        kmsHasta: busqueda.kmsHasta || null,
        potDesde: busqueda.potDesde || null,
        potHasta: busqueda.potHasta || null,
        precioDesde: busqueda.precioDesde || null,
        precioHasta: busqueda.precioHasta || null
      }
    });
  }
}
