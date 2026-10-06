import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
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
  selector: 'app-postventa-jaen.component',
  imports: [TranslatePipe, CommonModule, FontAwesomeModule],
  templateUrl: './postventa-jaen.component.html',
  styleUrl: './postventa-jaen.component.scss',
})
export default class PostventaJaenComponent {

  faTruckFront = faTruckFront;
  faCircleCheck = faCircleCheck;
  faPhone = faPhone;
  faLocationDot = faLocationDot;
  faEnvelope = faEnvelope;
  faClock = faClock;
  faMapLocationDot = faMapLocationDot;

  servicios: string[] = [
    'SERVICIOS_JAEN.MANTENIMIENTO_CAMIONES',
    'SERVICIOS_JAEN.FURGONETA_TALLER',
    'SERVICIOS_JAEN.MANTENIMIENTO_AUTOBUSES',
    'SERVICIOS_JAEN.SERVICIO_RUEDAS',
    'SERVICIOS_JAEN.SEMIRREMOLQUES',
    'SERVICIOS_JAEN.AIRE_ACONDICIONADO',
    'SERVICIOS_JAEN.EQUIPOS_FRIO',
    'SERVICIOS_JAEN.DIAGNOSTICO_VCADS',
    'SERVICIOS_JAEN.CHAPA_PINTURA',
    'SERVICIOS_JAEN.DESCARGA_TACOGRAFO',
    'SERVICIOS_JAEN.BANCADA_CHASIS',
    'SERVICIOS_JAEN.FRENOMETRO',
    'SERVICIOS_JAEN.ASISTENCIA_24H'
  ];
}
