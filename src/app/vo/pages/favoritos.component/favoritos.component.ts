import {
  Component,
  OnInit,
  inject,
  signal,
  DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';

import { VoService } from '../../services/vo.service';
import { IdiomaService } from '../../services/idioma.service';
import { FavoritoDto } from '../../interfaces/favorito.interface';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// 2. Importa los iconos necesarios
import { faStar, faBell, faCodeCompare, faFilePdf, faSpinner, faGaugeHigh, faRoad, faTruck } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, TranslatePipe, FontAwesomeModule],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.scss'
})
export default class FavoritosComponent implements OnInit {

  faStar = faStar;
  faStarRegular = faStarRegular;
  faBell = faBell;
  faCodeCompare = faCodeCompare;
  faFilePdf = faFilePdf;
  faSpinner = faSpinner;
  faGaugeHigh = faGaugeHigh;
  faRoad = faRoad;
  faTruck = faTruck;

  private readonly voService = inject(VoService);
  private readonly idiomaService = inject(IdiomaService);
  private readonly destroyRef = inject(DestroyRef);

  readonly favoritos = signal<FavoritoDto[]>([]);
  readonly cargando = signal(true);
  readonly email = signal('');

  // 1. Convertimos la Signal a Observable aquí (en el contexto de inyección)
  private readonly idioma$ = toObservable(this.idiomaService.idioma);

  ngOnInit(): void {
    const usuario = this.voService.usuarioActual;

    if (!usuario) {
      this.cargando.set(false);
      return;
    }

    this.email.set(usuario.mail ?? '');

    // 2. Nos suscribimos al Observable ya creado
    this.idioma$
      .pipe(
        switchMap(idiomaObj => {
          this.cargando.set(true);
          const idiomaCodigo = idiomaObj.codigo.toLowerCase();

          return this.voService.getFavoritos({
            idioma: idiomaCodigo,
            idUsr: usuario.numUsuario.toString()
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: favoritos => {
          if (!favoritos || favoritos.length === 0) {
            this.favoritos.set([]);
            this.cargando.set(false);
            return;
          }

          const idsStk = favoritos.map(x => x.idStoc.toString());

          this.voService.getImagenes(idsStk, 0).subscribe({
            next: (respuestaImagenes) => {
              const favoritosConImagen = favoritos.map((vehiculo, index) => {
                const imagen = respuestaImagenes.imagenes?.[index] ?? null;
                return {
                  ...vehiculo,
                  imagenBase64: imagen
                };
              });

              this.favoritos.set(favoritosConImagen);
              this.cargando.set(false);
            },
            error: (error) => {
              console.error('Error obteniendo imágenes:', error);
              const favoritosSinImagen = favoritos.map(vehiculo => ({
                ...vehiculo,
                imagenBase64: null
              }));

              this.favoritos.set(favoritosSinImagen);
              this.cargando.set(false);
            }
          });
        },
        error: err => {
          console.error('Error obteniendo favoritos:', err);
          this.cargando.set(false);
        }
      });
  }

  /**
   * Formatea el precio según el idioma seleccionado actualmente
   */
  getPrecio(precio: number): string {
    if (!precio || precio <= 0) {
      return '';
    }

    const localeMap: Record<string, string> = {
      'ES': 'es-ES',
      'EN': 'en-US',
      'FR': 'fr-FR'
    };

    const locale = localeMap[this.idiomaService.getCodigo()] || 'es-ES';

    return precio.toLocaleString(locale, {
      style: 'currency',
      currency: 'EUR'
    });
  }
}
