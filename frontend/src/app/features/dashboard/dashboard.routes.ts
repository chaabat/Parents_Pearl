import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { parentGuard } from '../../core/guards/parent.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'parent',
    canActivate: [authGuard, parentGuard],
    loadChildren: () => 
      import('../parent/parent.routes').then((m) => m.PARENT_ROUTES)
  },
  {
    path: 'child',
    canActivate: [authGuard],
    loadChildren: () => 
      import('../child/child.routes').then((m) => m.CHILD_ROUTES)
  },
  {
    path: '',
    redirectTo: 'parent',
    pathMatch: 'full'
  }
];

   