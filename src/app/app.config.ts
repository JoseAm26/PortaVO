import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import {
  provideRouter,
  withInMemoryScrolling
} from '@angular/router';

import {
  provideHttpClient
} from '@angular/common/http';

import {
  provideTranslateService
} from '@ngx-translate/core';

import {
  provideTranslateHttpLoader
} from '@ngx-translate/http-loader';

import {
  GoogleLoginProvider,
  SocialAuthServiceConfig
} from '@abacritt/angularx-social-login';

import { routes } from './app.routes';
import { environments } from '../environments/environments';

export const appConfig: ApplicationConfig = {
  providers: [

    provideBrowserGlobalErrorListeners(),

    provideHttpClient(),

    provideTranslateService({
      fallbackLang: 'es',
      lang: 'es',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      })
    }),

    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    ),

    {
      provide: 'SocialAuthServiceConfig' as any,
      useValue: {
        autoLogin: false,

        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environments.googleClientId)
          }
        ],

        onError: (err: any) => {
          console.error(err);
        }

      } satisfies SocialAuthServiceConfig
    }

  ]
};
