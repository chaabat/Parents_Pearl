import {  Actions, createEffect, ofType } from "@ngrx/effects"
import  { AuthService } from "../../core/services/auth.service"
import * as AuthActions from "./auth.actions"
import { catchError, map, mergeMap, tap } from "rxjs/operators"
import { of } from "rxjs"
import  { Router } from "@angular/router"
import { Injectable } from "@angular/core"

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((response) => {
            console.log("Login response in effect:", response)

            // Make sure we're getting the token from the right property
            const token = response.token || response.accessToken || response.jwt

            if (token) {
              console.log("Storing token:", token)
              localStorage.setItem("token", token)

              // Verify it was stored
              const storedToken = localStorage.getItem("token")
              console.log("Verified token in storage:", storedToken)
            } else {
              console.error("No token found in response:", response)
            }

            return AuthActions.loginSuccess({
              user: response.user || response,
              token: token,
            })
          }),
          catchError((error) => {
            let errorMessage = "🤔 An error occurred during login."

            // Handle specific error responses from the backend
            if (error.error?.message) {
              switch (error.status) {
                case 404:
                  errorMessage = "👤 No account exists with this email"
                  break
                case 401:
                  errorMessage = "🔐 Incorrect email or password"
                  break
                case 403:
                  errorMessage = "🚫 Your account has been disabled. Please contact admin@parentPearl.com."
                  break
                case 500:
                  errorMessage = "🛠️ A server error occurred during login"
                  break
                default:
                  // Use the backend message if available
                  errorMessage = `⚠️ ${error.error.message}`
              }
            }

            console.error("Login error:", error)
            return of(AuthActions.loginFailure({ error: errorMessage }))
          }),
        ),
      ),
    ),
  )

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap((action) => {
          if (action.token) {
            localStorage.setItem("token", action.token)
          }
          if (action.user) {
            localStorage.setItem("user", JSON.stringify(action.user))
          }
          this.router.navigate(["/dashboard"])
        }),
      ),
    { dispatch: false },
  )

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ userData }) => {
        console.log("AuthEffects: Processing registration data")

        // Ensure userData is FormData
        if (!(userData instanceof FormData)) {
          console.error("AuthEffects: userData is not FormData!")
        }

        return this.authService.register(userData).pipe(
          map((response) => {
            console.log("AuthEffects: Registration successful:", response)
            return AuthActions.registerSuccess()
          }),
          catchError((error) => {
            console.error("AuthEffects: Registration error:", error)
            let errorMessage = "🤔 Oops! Something went wrong during registration."

            // Check for specific error message about Content-Type
            if (error.error?.message?.includes("Content-Type")) {
              errorMessage = "🔄 Server expects multipart/form-data format. Please try again."
            }
            // First check the error message from the backend
            else if (error.error?.message) {
              if (
                error.error.message.includes("Email already exists") ||
                error.error.message.includes("Email déjà utilisé")
              ) {
                errorMessage = "📬 This email is already registered. Please try logging in or use a different email."
              } else if (error.error.message.includes("Invalid password")) {
                errorMessage = "🔒 Password must be at least 8 characters with letters and numbers."
              } else if (error.error.message.includes("Invalid email")) {
                errorMessage = "📧 Please enter a valid email address."
              } else if (error.error.message.includes("Age requirement")) {
                errorMessage = "🎂 You must be at least 18 years old to register."
              } else {
                // If it's another backend message, use it directly
                errorMessage = `⚠️ ${error.error.message}`
              }
            } else {
              // Fallback to HTTP status codes if no specific message
              switch (error.status) {
                case 403:
                  errorMessage =
                    "🚫 Registration forbidden. You may not have permission to register or the endpoint is incorrect."
                  break
                case 413:
                  errorMessage = "📸 Profile picture is too large (max 5MB)."
                  break
                case 415:
                  errorMessage = "🖼️ Invalid file type. Please use JPG, PNG, or GIF."
                  break
                case 429:
                  errorMessage = "⏳ Please wait a moment before trying again."
                  break
                case 500:
                  errorMessage =
                    "🛠️ Server error. Please try again later. Check if the registration endpoint is correct."
                  break
              }
            }

            return of(AuthActions.registerFailure({ error: errorMessage }))
          }),
        )
      }),
    ),
  )

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => {
          console.log("Navigating to login after successful registration")
          this.router.navigate(["/auth/login"])
        }),
      ),
    { dispatch: false },
  )

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          // Clear local storage
          localStorage.removeItem("token")
          localStorage.removeItem("user")

          // Navigate to login page
          this.router.navigate(["/auth/login"])
        }),
      ),
    { dispatch: false },
  )

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
  ) {}
}

