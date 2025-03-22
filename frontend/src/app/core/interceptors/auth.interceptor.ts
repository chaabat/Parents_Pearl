// auth.interceptor.ts
import { Injectable } from "@angular/core"
import type { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from "@angular/common/http"
import { type Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import type { Router } from "@angular/router"
import type { Store } from "@ngrx/store"
import * as AuthActions from "../../store/auth/auth.actions"
import { environment } from "../../../environments/environment"

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private store: Store,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem("token")
    const isApiUrl = request.url.startsWith(environment.apiUrl)

    // Check if this is a registration request
    const isRegistration = request.url.includes("/auth/register")

    // Log the request for debugging
    console.log(`Intercepting request to: ${request.url}`)
    console.log(`Is API URL: ${isApiUrl}, Is Registration: ${isRegistration}`)
    console.log(`Request body type: ${request.body instanceof FormData ? "FormData" : typeof request.body}`)

    // Only add the token for API requests that are not registration
    if (token && isApiUrl && !isRegistration) {
      console.log("Adding auth token to request")
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    }

    // For FormData requests, ensure we don't have a Content-Type header
    if (request.body instanceof FormData) {
      console.log("FormData detected - removing Content-Type header")

      // Clone the request without Content-Type header
      // This is crucial - the browser will set the correct multipart/form-data with boundary
      request = request.clone({
        headers: request.headers.delete("Content-Type"),
      })

      // Log the final headers for debugging
      console.log("Final request headers:", request.headers)
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(`Error ${error.status} for request to ${request.url}:`, error)

        if (error.status === 401) {
          console.log("401 Unauthorized error - logging out")
          this.store.dispatch(AuthActions.logout())
          this.router.navigate(["/auth/login"])
        }

        return throwError(() => error)
      }),
    )
  }
}

