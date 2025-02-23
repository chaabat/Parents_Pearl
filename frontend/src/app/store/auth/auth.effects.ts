import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { map, mergeMap, catchError, tap, exhaustMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(action =>
        this.authService.login(action.email, action.password).pipe(
          map(response => {
            console.log('Login success response:', response); // Debug log
            return AuthActions.loginSuccess({
              user: {
                id: response.id,
                email: response.email,
                firstName: response.firstName,
                lastName: response.lastName,
                role: response.role
              },
              token: response.token
            });
          }),
          catchError(error => {
            console.error('Login error:', error); // Debug log
            return of(AuthActions.loginFailure({ error: error.error?.message || 'Login failed' }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user }) => {
          const role = user.role.toLowerCase();
          this.router.navigate([`/dashboard/${role}`]);
        })
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap((action) =>
        this.authService.register(action).pipe(
          map((response) => AuthActions.registerSuccess({
            user: {
              id: response.id,
              email: response.email,
              firstName: response.firstName,
              lastName: response.lastName,
              role: response.role
            },
            token: response.token
          })),
          catchError((error) =>
            of(AuthActions.registerFailure({ error: error.message }))
          )
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => {
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  init$ = createEffect(() =>
    of(true).pipe(
      map(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            return AuthActions.loginSuccess({ user, token });
          } catch (e) {
            return AuthActions.logout();
          }
        }
        return AuthActions.logout();
      })
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
