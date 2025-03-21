import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          // Store user details and token in local storage
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));

          // Update the current user subject
          this.currentUserSubject.next(response.user);
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear current user
    this.currentUserSubject.next(null);

    // Navigate to login page
    this.router.navigate(['/login']);
  }

  refreshUserData(): void {
    // Reload user data from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  // Method to update user data in the service and localStorage
  updateUserData(userData: any): void {
    // Get current user data
    const currentUser = this.getCurrentUser();

    // Update with new data
    const updatedUser = { ...currentUser, ...userData };

    // Update localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Update the BehaviorSubject
    this.currentUserSubject.next(updatedUser);

    // Dispatch action to update store
    this.store.dispatch(AuthActions.updateUser({ user: updatedUser }));
  }

  register(userData: any): Observable<any> {
    console.log('AuthService: Starting registration process');

    const formData = new FormData();

    // Create the userData object with all required fields
    const userDataObj = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      dateOfBirth: userData.dateOfBirth,
      role: 'PARENT', // Set default role
    };

    console.log('UserData being sent:', { ...userDataObj, password: '***' });

    // Add userData as a JSON string
    formData.append('userData', JSON.stringify(userDataObj));

    // Add picture file separately if it exists
    if (userData.picture instanceof File) {
      formData.append('file', userData.picture, userData.picture.name);
    }

    // Log FormData entries for debugging (without password)
    formData.forEach((value, key) => {
      if (key === 'userData') {
        const parsed = JSON.parse(value as string);
        console.log('userData:', { ...parsed, password: '***' });
      } else {
        console.log(`${key}: ${value}`);
      }
    });

    return this.http.post(`${this.apiUrl}/auth/register`, formData).pipe(
      tap((response) => {
        console.log('Registration successful:', response);
      }),
      catchError((error) => {
        console.error('Registration error in service:', error);
        return throwError(() => error);
      })
    );
  }
}
