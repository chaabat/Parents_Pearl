import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { AuthState, UserRole } from '../../store/auth/auth.types';

export const roleGuard: CanActivateFn = (route) => {
  const store = inject(Store<{ auth: AuthState }>);
  const router = inject(Router);
  const allowedRoles: UserRole[] = route.data['roles'] || [];

  return store.select(state => state.auth).pipe(
    map(auth => {
      if (!auth.user || !auth.token) {
        router.navigate(['/auth/login']);
        return false;
      }

      if (!allowedRoles.includes(auth.user.role)) {
        // Redirect based on role
        switch (auth.user.role) {
          case 'PARENT':
            router.navigate(['/parent-dashboard']);
            break;
          case 'ADMIN':
            router.navigate(['/admin-dashboard']);
            break;
          case 'CHILD':
            router.navigate(['/child-dashboard']);
            break;
          default:
            router.navigate(['/']);
        }
        return false;
      }

      return true;
    })
  );
};
