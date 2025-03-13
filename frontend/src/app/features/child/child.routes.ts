import { Routes } from '@angular/router';
import { RoleGuard } from '../../core/guards/role.guard';
import { Role } from '../../core/models/user.model';

export const CHILD_ROUTES: Routes = [
  {
    path: 'child/tasks',
    canActivate: [RoleGuard],
    data: { roles: [Role.CHILD] },
    loadComponent: () =>
      import('./child-tasks/child-tasks.component').then((m) => m.ChildTasksComponent),
  },
  {
    path: 'child/rewards',
    canActivate: [RoleGuard],
    data: { roles: [Role.CHILD] },
    loadComponent: () =>
      import('./child-rewards/child-rewards.component').then((m) => m.ChildRewardsComponent),
  },
//   {
//     path: 'child/points',
//     canActivate: [RoleGuard],
//     data: { roles: [Role.CHILD] },
//     loadComponent: () =>
//       import('./child/child-points.component').then((m) => m.PointsComponent),
//   },
  {
    path: '',
    redirectTo: 'child/tasks',
    pathMatch: 'full',
  },
];



