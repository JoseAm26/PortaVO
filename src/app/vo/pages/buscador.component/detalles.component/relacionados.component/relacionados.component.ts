import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VehiculoDto } from '../../../../interfaces/vehiculos.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// 2. Importa los iconos que se usan en la plantilla
import {
  faTruckFront,
  faRoad,
  faGaugeHigh,
  faCouch,
  faGears,
  faArrowRight,
  faPlus,
  faMinus
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-relacionados',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, TranslatePipe, FontAwesomeModule],
  templateUrl: './relacionados.component.html',
  styleUrl: './relacionados.component.scss',
})
export class RelacionadosComponent {

  faTruckFront = faTruckFront;
  faRoad = faRoad;
  faGaugeHigh = faGaugeHigh;
  faCouch = faCouch;
  faGears = faGears;
  faArrowRight = faArrowRight;
  faPlus = faPlus;
  faMinus = faMinus;

  @Input({ required: true })
  relacionadosData: VehiculoDto[] = [];

  readonly incremento = 4;
  vehiculosMostrados = this.incremento;

  get relacionadosVisibles(): VehiculoDto[] {
    return this.relacionadosData.slice(0, this.vehiculosMostrados);
  }

  mostrarMas(): void {
    this.vehiculosMostrados = Math.min(
      this.vehiculosMostrados + this.incremento,
      this.relacionadosData.length
    );
  }

  mostrarMenos(): void {
    this.vehiculosMostrados = this.incremento;

    // Opcional: volver al inicio de la sección
    window.scrollTo({
      top: document.body.scrollHeight - 500,
      behavior: 'smooth'
    });
  }

  get quedanVehiculos(): boolean {
    return this.vehiculosMostrados < this.relacionadosData.length;
  }

  get puedeMostrarMenos(): boolean {
    return this.vehiculosMostrados > this.incremento;
  }

  formatearKm(valor: any): string {
    if (valor === null || valor === undefined || valor === '') {
      return '0';
    }

    return Number(valor).toLocaleString('es-ES');
  }


}
