import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Idioma {
  codigo: 'ES' | 'EN' | 'FR';
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class IdiomaService {

  private translate = inject(TranslateService);

  readonly idioma = signal<Idioma>({
    codigo: 'ES',
    nombre: 'Español'
  });

  constructor() {
    this.translate.use('es');
  }

  cambiarIdioma(idioma: Idioma): void {

    this.idioma.set(idioma);

    switch (idioma.codigo) {
      case 'ES':
        this.translate.use('es');
        break;

      case 'EN':
        this.translate.use('en');
        break;

      case 'FR':
        this.translate.use('fr');
        break;
    }
  }

  getCodigo(): string {
    return this.idioma().codigo;
  }

  getIdiomaCodigo(): string {
    return this.idioma().codigo.toLowerCase();
  }

}
