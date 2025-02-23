import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (m) => m.DASHBOARD_ROUTES
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    redirectTo: 'dashboard/admin',
    pathMatch: 'full',
  },
  {
    path: 'parent',
    redirectTo: 'dashboard/parent',
    pathMatch: 'full',
  },
  {
    path: 'child',
    redirectTo: 'dashboard/child',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
