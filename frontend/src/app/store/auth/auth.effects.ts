import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth.service';
import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((response) => {
            // Store token and user data
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            return AuthActions.loginSuccess({
              user: response.user,
              token: response.token,
            });
          }),
          catchError((error) => {
            let errorMessage =
              '🤔 Oops! Something went wrong while trying to log you in.';

            // First check the error message from the backend
            if (error.error?.message) {
              if (
                error.error.message.includes('User not found') ||
                error.error.message.includes('Utilisateur non trouvé')
              ) {
                errorMessage =
                  "👤 We couldn't find an account with this email. Please check your email or create a new account.";
              } else if (
                error.error.message.includes('Invalid password') ||
                error.error.message.includes('Mot de passe incorrect')
              ) {
                errorMessage =
                  '🔐 The password you entered is incorrect. Please try again.';
              } else if (
                error.error.message.includes('Account locked') ||
                error.error.message.includes('Compte bloqué')
              ) {
                errorMessage =
                  '🚫 Your account has been temporarily locked. Please contact support.';
              } else {
                // If it's another backend message, use it directly
                errorMessage = `⚠️ ${error.error.message}`;
              }
            } else {
              // Fallback to HTTP status codes if no specific message
              switch (error.status) {
                case 400:
                  errorMessage =
                    '📝 Please check your login details and try again.';
                  break;
                case 429:
                  errorMessage =
                    '⏳ Too many attempts. Please wait a few minutes before trying again.';
                  break;
                case 500:
                  errorMessage = '🛠️ Server error. Please try again later.';
                  break;
              }
            }

            return of(AuthActions.loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
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

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
