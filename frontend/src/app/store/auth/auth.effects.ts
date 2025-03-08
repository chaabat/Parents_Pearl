import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth.service';
import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthEffects {
  // auth.effects.ts
login$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.login),
    mergeMap(({ email, password }) =>
      this.authService.login(email, password).pipe(
        map((response) => {
          console.log('Login response in effect:', response);
          
          // Make sure we're getting the token from the right property
          const token = response.token || response.accessToken || response.jwt;
          
          if (token) {
            console.log('Storing token:', token);
            localStorage.setItem('token', token);
            
            // Verify it was stored
            const storedToken = localStorage.getItem('token');
            console.log('Verified token in storage:', storedToken);
          } else {
            console.error('No token found in response:', response);
          }
          
          return AuthActions.loginSuccess({
            user: response.user || response,
            token: token
          });
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return of(AuthActions.loginFailure({ error: error.message || 'Login failed' }));
        })
      )
    )
  )
);

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap((action) => {
          // Ensure token is saved
          if (action.token) {
            console.log('Saving token after login success:', action.token);
            localStorage.setItem('token', action.token);
            
            // IMPORTANT: Also save the user data
            if (action.user) {
              localStorage.setItem('user', JSON.stringify(action.user));
            }
          }
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ userData }) =>
        this.authService.register(userData).pipe(
          map(() => AuthActions.registerSuccess()),
          catchError((error) => {
            let errorMessage =
              '🤔 Oops! Something went wrong during registration.';

            // First check the error message from the backend
            if (error.error?.message) {
              if (
                error.error.message.includes('Email already exists') ||
                error.error.message.includes('Email déjà utilisé')
              ) {
                errorMessage =
                  '📬 This email is already registered. Please try logging in or use a different email.';
              } else if (error.error.message.includes('Invalid password')) {
                errorMessage =
                  '🔒 Password must be at least 8 characters with letters and numbers.';
              } else if (error.error.message.includes('Invalid email')) {
                errorMessage = '📧 Please enter a valid email address.';
              } else if (error.error.message.includes('Age requirement')) {
                errorMessage =
                  '🎂 You must be at least 18 years old to register.';
              } else {
                // If it's another backend message, use it directly
                errorMessage = `⚠️ ${error.error.message}`;
              }
            } else {
              // Fallback to HTTP status codes if no specific message
              switch (error.status) {
                case 413:
                  errorMessage = '📸 Profile picture is too large (max 5MB).';
                  break;
                case 415:
                  errorMessage =
                    '🖼️ Invalid file type. Please use JPG, PNG, or GIF.';
                  break;
                case 429:
                  errorMessage = '⏳ Please wait a moment before trying again.';
                  break;
                case 500:
                  errorMessage = '🛠️ Server error. Please try again later.';
                  break;
              }
            }

            return of(AuthActions.registerFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/auth/login']))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          // Clear token on logout
          localStorage.removeItem('token');
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
