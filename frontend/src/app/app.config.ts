import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { parentReducer } from './store/parent/parent.reducer';
import { ParentEffects } from './store/parent/parent.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { parentInterceptor } from './core/interceptors/parent.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, parentInterceptor])),
    provideAnimationsAsync(),
    provideStore({
      auth: authReducer,
      parent: parentReducer,
    }),
    provideEffects([AuthEffects, ParentEffects]),
    provideStoreDevtools({
      maxAge: 25,
    }),
  ],
};
