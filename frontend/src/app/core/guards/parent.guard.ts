import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

export const parentGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return of(true).pipe(
    map(() => {
      const isAuthenticated = authService.isAuthenticated();
      const isParent = authService.getUserRole() === 'PARENT';

      if (!isAuthenticated || !isParent) {
        router.navigate(['/auth/login']);
        return false;
      }
      return true;
    })
  );
}; 