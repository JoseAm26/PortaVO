import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// 2. Importa los iconos
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
  selector: 'app-postventa-antas.component',
  imports: [TranslatePipe, CommonModule, FontAwesomeModule],
  templateUrl: './postventa-antas.component.html',
  styleUrl: './postventa-antas.component.scss',
})
export default class PostventaAntasComponent {

  faTruckFront = faTruckFront;
  faCircleCheck = faCircleCheck;
  faPhone = faPhone;
  faLocationDot = faLocationDot;
  faEnvelope = faEnvelope;
  faClock = faClock;
  faMapLocationDot = faMapLocationDot;

  servicios: string[] = [
    'SERVICIOS_ANTAS.MANTENIMIENTO_CAMIONES',
    'SERVICIOS_ANTAS.FURGONETA_TALLER',
    'SERVICIOS_ANTAS.SEMIRREMOLQUES',
    'SERVICIOS_ANTAS.AIRE_ACONDICIONADO',
    'SERVICIOS_ANTAS.MANTENIMIENTO_AUTOBUSES',
    'SERVICIOS_ANTAS.DIAGNOSTICO_VCADS',
    'SERVICIOS_ANTAS.ASISTENCIA_24H'
  ];
}
