import { Routes } from '@angular/router';
import { RoleGuard } from '../../core/guards/role.guard';
import { Role } from '../../core/models/user.model';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin/users',
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN] },
    loadComponent: () =>
      import('./users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: '',
    redirectTo: 'admin/users',
    pathMatch: 'full',
  },
];
