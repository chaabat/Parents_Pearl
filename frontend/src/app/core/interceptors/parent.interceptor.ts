import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ParentActions } from '../../store/parent/parent.actions';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

@Injectable()
export class ParentInterceptor implements HttpInterceptor {
  constructor(private store: Store, private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Only intercept parent-related requests
    if (!request.url.includes('/api/parent')) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle specific parent-related errors
        if (error.status === 404) {
          this.store.dispatch(
            ParentActions.loadChildrenFailure({
              error: 'Resource not found',
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}

export const parentInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Only intercept parent API routes
  if (req.url.includes('/api/parents')) {
    const token = authService.getToken();
    const user = authService.getStoredUser();

    // Verify parent role
    if (user?.role !== 'PARENT') {
      return next(req);
    }

    const parentReq = req.clone({
      headers: req.headers
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .set('X-User-Role', 'PARENT'),
    });

    return next(parentReq);
  }

  return next(req);
};
