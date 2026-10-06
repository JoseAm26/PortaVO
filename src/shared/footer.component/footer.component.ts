import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
// 1. Importa FontAwesomeModule
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// 2. Importa los iconos sólidos y de marcas necesarios
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn
} from '@fortawesome/free-brands-svg-icons';


@Component({
  selector: 'shared-footer',
  imports: [
    TranslatePipe ,MatIconModule, RouterLink,
    FontAwesomeModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  faArrowUpRightFromSquare = faArrowUpRightFromSquare;
  faFacebookF = faFacebookF;
  faInstagram = faInstagram;
  faLinkedinIn = faLinkedinIn;
}
