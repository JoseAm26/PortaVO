import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// 2. Importa los iconos necesarios
import {
  faTruckFront,
  faCircleCheck,
  faPhone,
  faLocationDot,
  faEnvelope,
  faClock,
  faMapLocationDot
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-postventa-cordoba.component',
  imports: [TranslatePipe, CommonModule, FontAwesomeModule],
  templateUrl: './postventa-cordoba.component.html',
  styleUrl: './postventa-cordoba.component.scss',
})
export default class PostventaCordobaComponent {

  faTruckFront = faTruckFront;
  faCircleCheck = faCircleCheck;
  faPhone = faPhone;
  faLocationDot = faLocationDot;
  faEnvelope = faEnvelope;
  faClock = faClock;
  faMapLocationDot = faMapLocationDot;

  servicios: string[] = [
    'SERVICIOS_CORDOBA.MANTENIMIENTO_CAMIONES',
    'SERVICIOS_CORDOBA.FURGONETA_TALLER',
    'SERVICIOS_CORDOBA.SEMIRREMOLQUES',
    'SERVICIOS_CORDOBA.AIRE_ACONDICIONADO',
    'SERVICIOS_CORDOBA.MANTENIMIENTO_AUTOBUSES',
    'SERVICIOS_CORDOBA.DIAGNOSTICO_VCADS',
    'SERVICIOS_CORDOBA.ASISTENCIA_24H'
  ];
}
