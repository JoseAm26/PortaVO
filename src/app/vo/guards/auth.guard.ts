import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';

import { VoService } from '../services/vo.service';
import { LoginModalService } from '../services/login-modal.service';

export const authGuard: CanActivateFn = (_route, state) => {

  const voService = inject(VoService);
  const modalService = inject(LoginModalService);
  const router = inject(Router);

  return voService.cargarUsuario().pipe(

    map(resp => {

      if (resp.authenticated) {
        return true;
      }

      sessionStorage.setItem('returnUrl', state.url);

      setTimeout(() => modalService.abrir());

      router.navigateByUrl('/home');

      return false;
    }),

    catchError(() => {

      sessionStorage.setItem('returnUrl', state.url);

      setTimeout(() => modalService.abrir());

      router.navigateByUrl('/home');

      return of(false);
    })

  );
};
