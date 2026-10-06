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
  selector: 'app-postventa-sevilla.component',
  imports: [TranslatePipe, CommonModule, FontAwesomeModule],
  templateUrl: './postventa-sevilla.component.html',
  styleUrl: './postventa-sevilla.component.scss',
})
export default class PostventaSevillaComponent {

  faTruckFront = faTruckFront;
  faCircleCheck = faCircleCheck;
  faPhone = faPhone;
  faLocationDot = faLocationDot;
  faEnvelope = faEnvelope;
  faClock = faClock;
  faMapLocationDot = faMapLocationDot;

  servicios: string[] = [
    'SERVICIOS_SEVILLA.MANTENIMIENTO_CAMIONES',
    'SERVICIOS_SEVILLA.FURGONETA_TALLER',
    'SERVICIOS_SEVILLA.MANTENIMIENTO_AUTOBUSES',
    'SERVICIOS_SEVILLA.SERVICIO_RUEDAS',
    'SERVICIOS_SEVILLA.SEMIRREMOLQUES',
    'SERVICIOS_SEVILLA.AIRE_ACONDICIONADO',
    'SERVICIOS_SEVILLA.EQUIPOS_FRIO',
    'SERVICIOS_SEVILLA.DIAGNOSTICO_VCADS',
    'SERVICIOS_SEVILLA.CHAPA_PINTURA',
    'SERVICIOS_SEVILLA.DESCARGA_TACOGRAFO',
    'SERVICIOS_SEVILLA.BANCADA_CHASIS',
    'SERVICIOS_SEVILLA.FRENOMETRO',
    'SERVICIOS_SEVILLA.ASISTENCIA_24H'
  ];
}
