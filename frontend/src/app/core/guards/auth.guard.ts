import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { AuthState } from '../../store/auth/auth.types';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store<{ auth: AuthState }>);
  const router = inject(Router);

  return store.select(state => state.auth).pipe(
    take(1),
    map(auth => {
      console.log('Auth state:', auth); // Debug log
      const token = localStorage.getItem('token');
      
      if (!auth.user || !token) {
        console.log('No auth, redirecting to login'); // Debug log
        router.navigate(['/auth/login']);
        return false;
      }
      return true;
    })
  );
};
