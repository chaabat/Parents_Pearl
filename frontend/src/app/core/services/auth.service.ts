import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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

  constructor(private http: HttpClient) {
    // Initialize auth state from localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(JSON.parse(user));
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
      map((response: any) => {
        // Add the base URL to the picture path if it exists
        if (response.user.picture) {
          response.user.picture = `${this.baseUrl}/uploads/images/${response.user.picture}`;
        }
        return response;
      }),
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(response.user);
      })
    );
  }
}
