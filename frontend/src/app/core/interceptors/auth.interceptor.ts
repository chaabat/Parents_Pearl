// auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth/auth.actions';
import { HttpHeaders } from '@angular/common/http';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private store: Store) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Skip authentication for auth endpoints
    if (request.url.includes('/api/auth/')) {
      return next.handle(request);
    }

    const token = localStorage.getItem('token');
    console.log('Interceptor - URL:', request.url);
    console.log('Interceptor - Token exists:', !!token);

    if (token) {
      // Create a completely new request with the token
      const authReq = request.clone({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        })
      });
      
      // Log the headers to verify
      console.log('Interceptor - Headers sent:');
      authReq.headers.keys().forEach(key => {
        console.log(`${key}: ${authReq.headers.get(key)}`);
      });
      
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Interceptor - Request failed:', error);
          
          if (error.status === 401 || error.status === 403) {
            console.error('Interceptor - Auth error, redirecting to login');
            this.store.dispatch(AuthActions.logout());
            this.router.navigate(['/auth/login']);
          }
          
          return throwError(() => error);
        })
      );
    }

    // If no token, just pass the request through
    return next.handle(request);
  }
}