import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);
  private apiUrl = 'http://localhost:8080/api/auth';

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for existing token and user data on startup
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
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

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(response.user);
      })
    );
  }
}
