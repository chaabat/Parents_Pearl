import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../store/auth/auth.actions';
import * as AuthSelectors from '../../../store/auth/auth.selectors';
import {
  selectAuthError,
  selectAuthLoading,
} from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hidePassword = true;
  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    // Clear any existing errors when component initializes
    this.store.dispatch(AuthActions.clearError());
  }

  ngOnDestroy() {
    // Clear errors when component is destroyed
    this.store.dispatch(AuthActions.clearError());
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.store.dispatch(
        AuthActions.login({
          email: credentials.email,
          password: credentials.password,
        })
      );

      // Subscribe to auth state to handle token storage
      this.store.select(AuthSelectors.selectAuthState).subscribe({
        next: (authState) => {
          if (authState.token) {
            console.log('Storing token:', authState.token); // Debug log
            localStorage.setItem('token', authState.token);
          }
          if (authState.error) {
            console.error('Login error:', authState.error);
          }
        },
        error: (error) => console.error('Auth state error:', error),
      });
    }
  }

  // login.component.ts
login() {
  // Your existing login code
  this.store.dispatch(AuthActions.login({ 
    email: this.loginForm.value.email, 
    password: this.loginForm.value.password 
  }));
  
  // Add this subscription to see the response
  this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
    .subscribe(response => {
      console.log('Direct login response:', response);
      console.log('Token in response:', response.token);
      
      // Check if token is stored
      setTimeout(() => {
        const storedToken = localStorage.getItem('token');
        console.log('Token in localStorage after login:', storedToken);
      }, 1000);
    });
}
}
