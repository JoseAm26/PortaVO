import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
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
  selector: 'app-recambios-almeria.component',
  imports: [TranslatePipe, FontAwesomeModule, FontAwesomeModule],
  templateUrl: './recambios-almeria.component.html',
  styleUrl: './recambios-almeria.component.scss',
})
export default class RecambiosAlmeriaComponent {
  faGears = faGears;
  faCircleCheck = faCircleCheck;
  faPhone = faPhone;
  faLocationDot = faLocationDot;
  faEnvelope = faEnvelope;
  faClock = faClock;
  faMapLocationDot = faMapLocationDot;
}
