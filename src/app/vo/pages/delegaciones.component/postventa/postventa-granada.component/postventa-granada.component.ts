import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// 2. Importa los 7 iconos requeridos
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
  selector: 'app-postventa-granada.component',
  imports: [TranslatePipe, CommonModule, FontAwesomeModule],
  templateUrl: './postventa-granada.component.html',
  styleUrl: './postventa-granada.component.scss',
})
export default class PostventaGranadaComponent {

  faTruckFront = faTruckFront;
  faCircleCheck = faCircleCheck;
  faPhone = faPhone;
  faLocationDot = faLocationDot;
  faEnvelope = faEnvelope;
  faClock = faClock;
  faMapLocationDot = faMapLocationDot;

  servicios: string[] = [
    'SERVICIOS_GRANADA.MANTENIMIENTO_CAMIONES',
    'SERVICIOS_GRANADA.FURGONETA_TALLER',
    'SERVICIOS_GRANADA.MANTENIMIENTO_AUTOBUSES',
    'SERVICIOS_GRANADA.SERVICIO_RUEDAS',
    'SERVICIOS_GRANADA.SEMIRREMOLQUES',
    'SERVICIOS_GRANADA.AIRE_ACONDICIONADO',
    'SERVICIOS_GRANADA.EQUIPOS_FRIO',
    'SERVICIOS_GRANADA.DIAGNOSTICO_VCADS',
    'SERVICIOS_GRANADA.CHAPA_PINTURA',
    'SERVICIOS_GRANADA.DESCARGA_TACOGRAFO',
    'SERVICIOS_GRANADA.BANCADA_CHASIS',
    'SERVICIOS_GRANADA.FRENOMETRO',
    'SERVICIOS_GRANADA.ASISTENCIA_24H'
  ];
}
