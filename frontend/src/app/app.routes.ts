import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './shared/layouts/main-layout.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'parent/children',
        loadComponent: () =>
          import('./features/parent/children/children.component').then(
            (m) => m.ChildrenComponent
          ),
      },
      {
        path: 'parent/tasks',
        loadComponent: () =>
          import('./features/parent/tasks/tasks.component').then(
            (m) => m.TasksComponent
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
