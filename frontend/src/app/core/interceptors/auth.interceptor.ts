import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip auth endpoints
  if (req.url.includes('/api/auth')) {
    return next(req);
  }

  const token = authService.getToken();
  console.log('Request URL:', req.url); // Debug log
  console.log('Token:', token); // Debug log

  if (!token) {
    router.navigate(['/auth/login']);
    return throwError(() => new Error('No token'));
  }

  const authReq = req.clone({
    headers: req.headers
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
  });

  console.log('Request headers:', authReq.headers.get('Authorization')); // Debug log

  return next(authReq).pipe(
    catchError(error => {
      console.error('HTTP Error:', error); // Debug log
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
