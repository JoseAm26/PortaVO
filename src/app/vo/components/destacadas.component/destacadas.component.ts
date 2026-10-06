import { Component, inject, OnInit, signal, HostListener } from '@angular/core';
import { Destacado } from '../../interfaces/destacado.interface';
import { VoService } from '../../services/vo.service';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// 2. Importa los 4 iconos necesarios
import {
  faChevronLeft,
  faChevronRight,
  faGaugeHigh,
  faGasPump
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-destacadas',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, TranslatePipe, FontAwesomeModule],
  templateUrl: './destacadas.component.html',
  styleUrl: './destacadas.component.scss',
})
export class DestacadasComponent implements OnInit {

  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faGaugeHigh = faGaugeHigh;
  faGasPump = faGasPump;

  private voService = inject(VoService);

  public vehiculosDestacados = signal<Destacado[]>([]);
  public cargandoDestacados = signal(false);

  public indiceActual = signal<number>(0);
  public anchoPantalla = signal<number>(window.innerWidth);

  @HostListener('window:resize')
  onResize(): void {
    this.anchoPantalla.set(window.innerWidth);
    if (this.indiceActual() > this.maxIndiceVisible) {
      this.indiceActual.set(this.maxIndiceVisible);
    }
  }

  ngOnInit(): void {
    this.cargarDestacados();
  }

  private cargarDestacados(): void {
    this.cargandoDestacados.set(true);

    this.voService.getDestacados().subscribe({
      next: (destacados) => {
        if (!destacados || destacados.length === 0) {
          this.vehiculosDestacados.set([]);
          this.cargandoDestacados.set(false);
          return;
        }

        const idsStk = destacados.map(x => x.idStoc.toString());

        this.voService.getImagenes(idsStk, 0).subscribe({
          next: (respuestaImagenes) => {
            const vehiculosConImagen = destacados.map((vehiculo, index) => {
              const imagen = respuestaImagenes.imagenes?.[index] ?? null;
              return {
                ...vehiculo,
                imagenBase64: imagen
              };
            });

            this.vehiculosDestacados.set(vehiculosConImagen);
            this.cargandoDestacados.set(false);
          },
          error: (error) => {
            console.error('Error obteniendo imágenes:', error);
            const vehiculosSinImagen = destacados.map(vehiculo => ({
              ...vehiculo,
              imagenBase64: null
            }));

            this.vehiculosDestacados.set(vehiculosSinImagen);
            this.cargandoDestacados.set(false);
          }
        });
      },
      error: (error) => {
        console.error('Error obteniendo destacados:', error);
        this.vehiculosDestacados.set([]);
        this.cargandoDestacados.set(false);
      }
    });
  }

  getImagenVehiculo(vehiculo: Destacado): string {
    if (!vehiculo.imagenBase64) {
      return 'assets/camiones/sin-imagen.jpg';
    }
    return `data:image/jpeg;base64,${vehiculo.imagenBase64}`;
  }

  // Número de ítems a desplegar según ancho
  get itemsVisibles(): number {
    const width = this.anchoPantalla();
    if (width < 640) return 1;
    if (width < 1024) return 2;
    return 3;
  }

  get maxIndiceVisible(): number {
    const total = this.vehiculosDestacados().length;
    return Math.max(0, total - this.itemsVisibles);
  }

  getTransformTrack(): string {
    const porcentajeUnidad = 100 / this.itemsVisibles;
    const desplazamiento = this.indiceActual() * porcentajeUnidad;
    return `translateX(-${desplazamiento}%)`;
  }

  siguiente(): void {
    if (this.vehiculosDestacados().length === 0) return;

    this.indiceActual.update(i => {
      if (i >= this.maxIndiceVisible) {
        return 0;
      }
      return i + 1;
    });
  }

  anterior(): void {
    if (this.vehiculosDestacados().length === 0) return;

    this.indiceActual.update(i => {
      if (i <= 0) {
        return this.maxIndiceVisible;
      }
      return i - 1;
    });
  }

  irAlIndice(index: number): void {
    this.indiceActual.set(Math.min(index, this.maxIndiceVisible));
  }
}
