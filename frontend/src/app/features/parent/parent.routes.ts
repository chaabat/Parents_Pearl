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
    path: 'parent/tasks',
    canActivate: [RoleGuard],
    data: { roles: [Role.PARENT] },
    loadComponent: () =>
      import('./tasks/tasks.component').then((m) => m.TasksComponent),
  },
  {
    path: 'parent/rewards',
    canActivate: [RoleGuard],
    data: { roles: [Role.PARENT] },
    loadComponent: () =>
      import('./rewards/rewards.component').then((m) => m.RewardsComponent),
  },
  {
    path: 'parent/points',
    canActivate: [RoleGuard],
    data: { roles: [Role.PARENT] },
    loadComponent: () =>
      import('./profil/profil.component').then((m) => m.ProfilComponent),
  },
  {
    path: '',
    redirectTo: 'parent/children',
    pathMatch: 'full',
  },
];
