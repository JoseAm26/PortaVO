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
  selector: 'app-postventa-almeria.component',
  imports: [TranslatePipe, FontAwesomeModule],
  templateUrl: './postventa-almeria.component.html',
  styleUrl: './postventa-almeria.component.scss',
})
export default class PostventaAlmeriaComponent {

  faTruckFront = faTruckFront;
  faCircleCheck = faCircleCheck;
  faPhone = faPhone;
  faLocationDot = faLocationDot;
  faEnvelope = faEnvelope;
  faClock = faClock;
  faMapLocationDot = faMapLocationDot;

  nombre = 'VEINSUR ALMERÍA';
  subtitulo = 'CONCESIONARIO VOLVO TRUCKS';
  descripcionCorta = 'Construimos relaciones sólidas y duraderas con nuestros clientes ofreciendo un servicio profesional ágil y eficiente caracterizado por la excelencia.';
  descripcionLarga = 'Respaldada por una filosofía de trabajo que persigue la excelencia y un equipo de profesionales cualificados y de gran experiencia, Veinsur ofrece soluciones globales que ayudan al cliente a simplificar la gestión de su empresa.';

  // Datos de contacto
  telefono = '950 212 000';
  telefonoLink = 'tel:950212000';
  direccion = 'A-1000, nº 32, 04230 Huércal de Almería (Almería)';
  direccionLink = 'https://g.page/veinsuralmeria?share';
  email = 'veinsur@veinsur.es';
  emailLink = 'mailto:veinsur@veinsur.es';

  // Listado de servicios para renderizar dinámicamente con @for
  // almeria-postventa.component.ts
  servicios: string[] = [
    'SERVICIOS_ALMERIA.MANTENIMIENTO_CAMIONES',
    'SERVICIOS_ALMERIA.FURGONETA_TALLER',
    'SERVICIOS_ALMERIA.MANTENIMIENTO_AUTOBUSES',
    'SERVICIOS_ALMERIA.SERVICIO_RUEDAS',
    'SERVICIOS_ALMERIA.SEMIRREMOLQUES',
    'SERVICIOS_ALMERIA.AIRE_ACONDICIONADO',
    'SERVICIOS_ALMERIA.EQUIPOS_FRIO',
    'SERVICIOS_ALMERIA.DIAGNOSTICO_VCADS',
    'SERVICIOS_ALMERIA.CHAPA_PINTURA',
    'SERVICIOS_ALMERIA.DESCARGA_TACOGRAFO',
    'SERVICIOS_ALMERIA.BANCADA_CHASIS',
    'SERVICIOS_ALMERIA.FRENOMETRO',
    'SERVICIOS_ALMERIA.ASISTENCIA_24H'
  ];
}
