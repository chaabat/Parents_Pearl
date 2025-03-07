import { Routes } from '@angular/router';
import { RoleGuard } from '../../core/guards/role.guard';
import { Role } from '../../core/models/user.model';

export const PARENT_ROUTES: Routes = [
  {
    path: 'parent/children',
    canActivate: [RoleGuard],
    data: { roles: [Role.PARENT] },
    loadComponent: () =>
      import('./children/children.component').then((m) => m.ChildrenComponent),
  },
  {
    path: '',
    redirectTo: 'parent/children',
    pathMatch: 'full',
  },
];
