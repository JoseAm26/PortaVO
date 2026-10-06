import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
// 1. Importa FontAwesomeModule
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
  selector: 'app-postventa-malaga.component',
  imports: [TranslatePipe, CommonModule, FontAwesomeModule],
  templateUrl: './postventa-malaga.component.html',
  styleUrl: './postventa-malaga.component.scss',
})
export default class PostventaMalagaComponent {

  faTruckFront = faTruckFront;
  faCircleCheck = faCircleCheck;
  faPhone = faPhone;
  faLocationDot = faLocationDot;
  faEnvelope = faEnvelope;
  faClock = faClock;
  faMapLocationDot = faMapLocationDot;

  servicios: string[] = [
    'SERVICIOS_MALAGA.MANTENIMIENTO_CAMIONES',
    'SERVICIOS_MALAGA.FURGONETA_TALLER',
    'SERVICIOS_MALAGA.MANTENIMIENTO_AUTOBUSES',
    'SERVICIOS_MALAGA.SERVICIO_RUEDAS',
    'SERVICIOS_MALAGA.SEMIRREMOLQUES',
    'SERVICIOS_MALAGA.AIRE_ACONDICIONADO',
    'SERVICIOS_MALAGA.EQUIPOS_FRIO',
    'SERVICIOS_MALAGA.DIAGNOSTICO_VCADS',
    'SERVICIOS_MALAGA.CHAPA_PINTURA',
    'SERVICIOS_MALAGA.DESCARGA_TACOGRAFO',
    'SERVICIOS_MALAGA.BANCADA_CHASIS',
    'SERVICIOS_MALAGA.FRENOMETRO',
    'SERVICIOS_MALAGA.ASISTENCIA_24H'
  ];
}
