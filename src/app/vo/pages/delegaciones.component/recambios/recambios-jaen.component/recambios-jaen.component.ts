import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
// 1. Importa FontAwesomeModule
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// 2. Importa los iconos necesarios
import {
  faGears,
  faCircleCheck,
  faPhone,
  faLocationDot,
  faEnvelope,
  faClock,
  faMapLocationDot
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-recambios-jaen.component',
  imports: [TranslatePipe, FontAwesomeModule],
  templateUrl: './recambios-jaen.component.html',
  styleUrl: './recambios-jaen.component.scss',
})
export default class RecambiosJaenComponent {
  faGears = faGears;
  faCircleCheck = faCircleCheck;
  faPhone = faPhone;
  faLocationDot = faLocationDot;
  faEnvelope = faEnvelope;
  faClock = faClock;
  faMapLocationDot = faMapLocationDot;

  
}
