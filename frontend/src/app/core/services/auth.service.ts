import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../../store/auth/auth.types';

interface AuthResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    console.log('Login attempt:', { email }); // Debug log
    
    return this.http
      .post<AuthResponse>(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap(response => {
          console.log('Login response:', response); // Debug log
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify({
            id: response.id,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            role: response.role
          }));
        })
      );
  }

  register(userData: any): Observable<AuthResponse> {
    const registerData = {
      ...userData,
      role: 'PARENT',
      // Add any other required fields
    };
    
    return this.http
      .post<AuthResponse>(`${this.API_URL}/register/parent`, registerData)
      .pipe(
        tap((response) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response));
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr).role : 'GUEST';
    } catch {
      return 'GUEST';
    }
  }

  getStoredUser(): any {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
}
