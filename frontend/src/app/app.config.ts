import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { parentReducer } from './store/parent/parent.reducer';
import { ParentEffects } from './store/parent/parent.effects';
import { childReducer } from './store/child/child.reducer';
import { ChildEffects } from './store/child/child.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideStore({
      auth: authReducer,
      parent: parentReducer,
      child: childReducer
    }),
    provideEffects([
      AuthEffects,
      ParentEffects,
      ChildEffects
    ]),
    provideStoreDevtools({ maxAge: 25 }),
  ],
};
