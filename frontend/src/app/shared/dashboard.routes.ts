import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../core/guards/auth.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'parent',
        loadChildren: () =>
          import('../features/parent/parent.routes').then(
            (m) => m.PARENT_ROUTES
          ),
      },
    ],
  },
];
