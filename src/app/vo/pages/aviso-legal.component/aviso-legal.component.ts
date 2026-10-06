import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-aviso-legal.component',
  imports: [TranslatePipe],
  templateUrl: './aviso-legal.component.html',
  styleUrl: './aviso-legal.component.scss',
})
export default class AvisoLegalComponent {}
