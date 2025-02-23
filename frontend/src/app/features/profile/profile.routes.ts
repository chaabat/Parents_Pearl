import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { ProfileComponent } from './profile.component';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'child/:id',
    component: ProfileComponent,
    canActivate: [authGuard]
  }
]; 