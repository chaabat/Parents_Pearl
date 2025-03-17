import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { Parent } from '../models/parent.model';
import { Child } from '../models/child.model';
import { Admin } from '../models/admin.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // User Management
  getAllParents(): Observable<Parent[]> {
    return this.http
      .get<Parent[]>(`${this.apiUrl}/admin/parents`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((parents) => console.log('Fetched all parents:', parents)),
        catchError((error) => {
          console.error('Error fetching parents:', error);
          throw error;
        })
      );
  }

  getAllChildren(): Observable<Child[]> {
    return this.http
      .get<Child[]>(`${this.apiUrl}/admin/children`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((children) => console.log('Fetched all children:', children)),
        catchError((error) => {
          console.error('Error fetching children:', error);
          throw error;
        })
      );
  }

  getAllAdmins(): Observable<Admin[]> {
    return this.http
      .get<Admin[]>(`${this.apiUrl}/admin/admins`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(tap((admins) => console.log('Fetched all admins:', admins)));
  }

  // Ban Management
  getBannedUsers(): Observable<any[]> {
    console.log('Fetching banned users...');
    return forkJoin({
      parents: this.http.get<any[]>(`${this.apiUrl}/admin/parents/banned`, {
        headers: this.getAuthHeaders(),
      }),
      children: this.http.get<any[]>(`${this.apiUrl}/admin/children/banned`, {
        headers: this.getAuthHeaders(),
      }),
    }).pipe(
      map(({ parents, children }) => [
        ...parents.map((parent) => ({ ...parent, userType: 'parent' })),
        ...children.map((child) => ({ ...child, userType: 'child' })),
      ]),
      tap((users) => console.log('Combined banned users:', users)),
      catchError((error) => {
        console.error('Error fetching banned users:', error);
        throw error;
      })
    );
  }

  banUser(userId: number, userType: 'parent' | 'child'): Observable<void> {
    return this.http
      .post<void>(
        `${this.apiUrl}/admin/users/${userId}/ban`,
        {},
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        tap(() => console.log(`Banned user ${userId}`)),
        catchError((error) => {
          console.error('Error banning user:', error);
          throw error;
        })
      );
  }

  unbanUser(userId: number, userType: 'parent' | 'child'): Observable<void> {
    return this.http
      .post<void>(
        `${this.apiUrl}/admin/users/${userId}/unban`,
        {},
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        tap(() => console.log(`Unbanned user ${userId}`)),
        catchError((error) => {
          console.error('Error unbanning user:', error);
          throw error;
        })
      );
  }

  // Admin Profile Management
  getAdminProfile(id: number): Observable<Admin> {
    return this.http
      .get<Admin>(`${this.apiUrl}/admin/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(tap((profile) => console.log('Fetched admin profile:', profile)));
  }

  updateAdminProfile(id: number, data: Partial<Admin>): Observable<Admin> {
    return this.http
      .put<Admin>(`${this.apiUrl}/admin/${id}`, data, {
        headers: this.getAuthHeaders(),
      })
      .pipe(tap((updated) => console.log('Updated admin profile:', updated)));
  }

  // Statistics
  getSystemStats(): Observable<{
    activeUsers: number;
    bannedUsers: number;
    completedTasks: number;
  }> {
    return this.http
      .get<any>(`${this.apiUrl}/admin/stats`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(tap((stats) => console.log('Fetched system stats:', stats)));
  }
}
