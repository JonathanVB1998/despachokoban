import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HomeUserCases } from './modulos/home/domain/usecase/home-usecase';
import { HomeUserApiImpl } from './modulos/home/infraestructure/home-api-impl';
import { HomeGateway } from './modulos/home/domain/gateway/home-gateway';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideHttpClient(), // HttpClient global

    {provide: HomeGateway, useClass: HomeUserApiImpl},
    HomeUserCases

  ]
};
