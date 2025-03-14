import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);
  private apiUrl = `${environment.apiUrl}/auth`;
  private baseUrl = environment.apiUrl;

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private store: Store) {
    // Initialize auth state from localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    console.log('Token being used:', token);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    console.log('Headers being sent:', headers);
    return headers;
  }

  logout(): Observable<any> {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear auth state
    this.store.dispatch(AuthActions.logout());

    // Make API call to logout
    return this.http.post(
      `${this.apiUrl}/auth/logout`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  register(userData: any): Observable<any> {
    const formData = new FormData();
    const userDataCopy = { ...userData };

    console.log('userData before processing:', userDataCopy);

    // Handle file separately
    if (userDataCopy.picture instanceof File) {
      console.log('Appending file:', userDataCopy.picture);
      formData.append('file', userDataCopy.picture);
      delete userDataCopy.picture;
    }

    // Add the rest of the data as a JSON string
    formData.append('userData', JSON.stringify(userDataCopy));

    return this.http.post<any>(`${this.apiUrl}/register`, formData);
  }

  // auth.service.ts
  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          console.log('Login response in service:', response);

          // Check for token in different possible properties
          const token = response.token || response.accessToken || response.jwt;

          if (token) {
            console.log('Storing token in service:', token);
            localStorage.setItem('token', token);
            this.isAuthenticatedSubject.next(true);

            // Store user if available
            if (response.user) {
              localStorage.setItem('user', JSON.stringify(response.user));
              this.currentUserSubject.next(response.user);
            }
          } else {
            console.error('No token found in response in service:', response);
          }
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
