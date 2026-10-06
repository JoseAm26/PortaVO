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
  selector: 'app-recambios-granada.component',
  imports: [TranslatePipe, FontAwesomeModule],
  templateUrl: './recambios-granada.component.html',
  styleUrl: './recambios-granada.component.scss',
})
export default class RecambiosGranadaComponent {
  faGears = faGears;
  faCircleCheck = faCircleCheck;
  faPhone = faPhone;
  faLocationDot = faLocationDot;
  faEnvelope = faEnvelope;
  faClock = faClock;
  faMapLocationDot = faMapLocationDot;
}
