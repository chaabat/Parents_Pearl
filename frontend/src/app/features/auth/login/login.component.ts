import { Component,  OnInit,  OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule,  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { AuthService } from "../../../core/services/auth.service"
import  { Router } from "@angular/router"
import { RouterLink } from "@angular/router"
import  { Store } from "@ngrx/store"
import * as AuthActions from "../../../store/auth/auth.actions"
import * as AuthSelectors from "../../../store/auth/auth.selectors"
import { selectAuthError, selectAuthLoading } from "../../../store/auth/auth.selectors"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup
  hidePassword = true
  loading$ = this.store.select(selectAuthLoading)
  error$ = this.store.select(selectAuthError)
  errorMessage = ""

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  ngOnInit() {
    // Clear any existing errors when component initializes
    this.store.dispatch(AuthActions.clearError())
  }

  ngOnDestroy() {
    // Clear errors when component is destroyed
    this.store.dispatch(AuthActions.clearError())
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value

      this.store.dispatch(
        AuthActions.login({
          email: credentials.email,
          password: credentials.password,
        }),
      )

      // Subscribe to auth state to handle token storage
      this.store.select(AuthSelectors.selectAuthState).subscribe({
        next: (authState) => {
          if (authState.token) {
            console.log("Storing token:", authState.token)
            localStorage.setItem("token", authState.token)
          }
          if (authState.error) {
            console.error("Login error:", authState.error)
          }
        },
        error: (error) => console.error("Auth state error:", error),
      })
    } else {
      // Trigger form validation
      Object.keys(this.loginForm.controls).forEach((key) => {
        const control = this.loginForm.get(key)
        if (control) {
          control.markAsTouched()
        }
      })
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword
  }

  // Helper method to check if a field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName)
    return field ? field.invalid && field.touched : false
  }

  // Helper method to get error message for a field
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName)
    if (!field) return ""

    if (fieldName === "email") {
      if (field.hasError("required")) return "Email is required"
      if (field.hasError("email")) return "Please enter a valid email"
    }

    if (fieldName === "password") {
      if (field.hasError("required")) return "Password is required"
      if (field.hasError("minlength")) return "Password must be at least 6 characters"
    }

    return ""
  }
}

