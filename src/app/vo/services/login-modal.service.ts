import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginModalService {

  private mostrarModalSubject = new BehaviorSubject<boolean>(false);

  mostrarModal$ = this.mostrarModalSubject.asObservable();

  abrir(): void {
    this.mostrarModalSubject.next(true);
  }

  cerrar(): void {
    this.mostrarModalSubject.next(false);
  }

}
