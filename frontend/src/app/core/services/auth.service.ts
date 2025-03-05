import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);
  private apiUrl = 'http://localhost:8080/api/auth';

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  register(userData: any): Observable<any> {
    const formData = new FormData();
    const userDataCopy = { ...userData };
    
    // Handle file separately
    if (userDataCopy.picture) {
      formData.append('file', userDataCopy.picture);
      delete userDataCopy.picture;
    }

    // Add the rest as JSON string
    formData.append('userData', JSON.stringify(userDataCopy));

    return this.http.post(`${this.apiUrl}/register`, formData);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }
}
