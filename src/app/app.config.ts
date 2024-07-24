import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  
  providers: [
    provideRouter(routes),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('328824258579-8173qq42qp7fmq156r2nr46rqbd63gk7.apps.googleusercontent.com'),
          },
        ],
      } as SocialAuthServiceConfig,
    },  
    importProvidersFrom(HttpClientModule),      
    
  ]
};
