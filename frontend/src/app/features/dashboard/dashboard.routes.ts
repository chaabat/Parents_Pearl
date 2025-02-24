import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { DashboardComponent } from './dashboard.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'parent',
        pathMatch: 'full',
      },
      {
        path: 'parent',
        loadChildren: () =>
          import('../parent/parent.routes').then((m) => m.PARENT_ROUTES),
      },
      // {
      //   path: 'admin',
      //   loadChildren: () =>
      //     import('../admin/admin.routes').then((m) => m.ADMIN_ROUTES)
      // }
    ],
  },
];
