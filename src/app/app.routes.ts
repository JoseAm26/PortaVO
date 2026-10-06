import { Routes } from '@angular/router';
import { authGuard } from './vo/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    title: 'Inicio',
    loadComponent: () => import('./vo/pages/home.component/home.component')
  },
  {
    path: 'buscador',
    title: 'Buscador',
    loadComponent: () => import('./vo/pages/buscador.component/buscador.component')
  },
  {
    path: 'login',
    title: 'Login',
    children: [
      {
        path: '', // Se carga en '/login'
        loadComponent: () => import('./vo/pages/login.component/login.component')
      },
      {
        path: 'registro', // Se carga en '/login/registro'
        title: 'Registro',
        loadComponent: () => import('./vo/pages/login.component/registrar.component/registrar.component')
      },
      {
        path: 'activar/:token',
        title: 'Activar',
        loadComponent: () => import('./vo/pages/login.component/activar.component/activar.component')
      },
      {
        path: 'password',
        title: 'Contraseña',
        loadComponent: () => import('./vo/pages/login.component/password.component/password.component')
      },
      {
        path: 'reset-password/:token',
        title: 'Resetear Contraseña',
        loadComponent: () => import('./vo/pages/login.component/reset-password.component/reset-password.component')
      }
    ]
  },
  {
    path: 'delegaciones',
    title: 'Delegaciones',
    children: [
      {
        path: '',
        loadComponent: () => import('./vo/pages/delegaciones.component/delegaciones.component')
      },
      {
        path: 'postventa/almeria',
        title: 'Postventa Almería',
        loadComponent: () => import('./vo/pages/delegaciones.component/postventa/postventa-almeria.component/postventa-almeria.component')
      },
      {
        path: 'postventa/antas',
        title: 'Postventa Antas',
        loadComponent: () => import('./vo/pages/delegaciones.component/postventa/postventa-antas.component/postventa-antas.component')
      },
      {
        path: 'postventa/cordoba',
        title: 'Postventa Córdoba',
        loadComponent: () => import('./vo/pages/delegaciones.component/postventa/postventa-cordoba.component/postventa-cordoba.component')
      },
      {
        path: 'postventa/granada',
        title: 'Postventa Granada',
        loadComponent: () => import('./vo/pages/delegaciones.component/postventa/postventa-granada.component/postventa-granada.component')
      },
      {
        path: 'postventa/jaen',
        title: 'Postventa Jaén',
        loadComponent: () => import('./vo/pages/delegaciones.component/postventa/postventa-jaen.component/postventa-jaen.component')
      },
      {
        path: 'postventa/malaga',
        title: 'Postventa Málaga',
        loadComponent: () => import('./vo/pages/delegaciones.component/postventa/postventa-malaga.component/postventa-malaga.component')
      },
      {
        path: 'postventa/sevilla',
        title: 'Postventa Sevilla',
        // CORREGIDO: Ahora apunta a Sevilla
        loadComponent: () => import('./vo/pages/delegaciones.component/postventa/postventa-sevilla.component/postventa-sevilla.component')
      },
      {
        path: 'recambios/almeria',
        title: 'Recambios Almería',
        loadComponent: () => import('./vo/pages/delegaciones.component/recambios/recambios-almeria.component/recambios-almeria.component')
      },
      {
        path: 'recambios/antas',
        title: 'Recambios Antas',
        loadComponent: () => import('./vo/pages/delegaciones.component/recambios/recambios-antas.component/recambios-antas.component')
      },
      {
        path: 'recambios/cordoba',
        title: 'Recambios Córdoba',
        loadComponent: () => import('./vo/pages/delegaciones.component/recambios/recambios-cordoba.component/recambios-cordoba.component')
      },
      {
        path: 'recambios/granada',
        title: 'Recambios Granada',
        loadComponent: () => import('./vo/pages/delegaciones.component/recambios/recambios-granada.component/recambios-granada.component')
      },
      {
        path: 'recambios/jaen',
        title: 'Recambios Jaén',
        loadComponent: () => import('./vo/pages/delegaciones.component/recambios/recambios-jaen.component/recambios-jaen.component')
      },
      {
        path: 'recambios/malaga',
        title: 'Recambios Málaga',
        loadComponent: () => import('./vo/pages/delegaciones.component/recambios/recambios-malaga.component/recambios-malaga.component')
      },
      {
        path: 'recambios/sevilla',
        title: 'Recambios Sevilla',
        loadComponent: () => import('./vo/pages/delegaciones.component/recambios/recambios-sevilla.component/recambios-sevilla.component')
      },
    ]
  },
  {
    path: 'detalle/:idStock',
    title: 'Detalle vehículo',
    loadComponent: () =>
      import('./vo/pages/buscador.component/detalles.component/detalles.component')
  },
  {
    path: 'favoritos',
    title: 'Favoritos',
    canActivate: [authGuard],
    loadComponent: () => import('./vo/pages/favoritos.component/favoritos.component')
  },
  {
    path: 'busquedas',
    title: 'Busquedas',
    canActivate: [authGuard],
    loadComponent: () => import('./vo/pages/busquedas.component/busquedas.component')
  },
  {
    path: 'comparador',
    title: 'Comparador',
    loadComponent: () => import('./vo/pages/comparador.component/comparador.component')
  },
  {
    path: 'aviso-legal',
    title: 'Aviso Legal',
    loadComponent: () => import('./vo/pages/aviso-legal.component/aviso-legal.component')
  },
  {
    path: 'politica-redes-sociales',
    title: 'Politica de Redes Sociales',
    loadComponent: () => import('./vo/pages/politica-redes-sociales.component/politica-redes-sociales.component')
  },
  {
    path: 'politica-privacidad',
    title: 'Politica de Privacidad',
    loadComponent: () => import('./vo/pages/politica-privacidad.component/politica-privacidad.component')
  },
  {
    path: 'politica-cookies',
    title: 'Politica de Cookies',
    loadComponent: () => import('./vo/pages/politica-cookies.component/politica-cookies.component')
  },
  {
    path: 'peticiones',
    title: 'Peticiones',
    canActivate: [authGuard],
    loadComponent: () => import('./vo/pages/peticiones.component/peticiones.component')
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
