import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const CHILD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./child.component').then(m => m.ChildComponent),
    canActivate: [authGuard]
  }
]; 