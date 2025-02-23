import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Child, Task, BehaviorRecord, CalendarEvent } from '../types/api.types';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { catchError, throwError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParentService {
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Children endpoints
  getChildren(): Observable<Child[]> {
    const token = this.authService.getToken();
    console.log('Getting children with token:', token); // Debug log
    
    return this.http.get<Child[]>(`${this.API_URL}/parents/children`).pipe(
      tap(response => console.log('Children response:', response)), // Debug log
      catchError(error => {
        console.error('Error fetching children:', error);
        return throwError(() => error);
      })
    );
  }

  addChild(child: Omit<Child, 'id' | 'parentId'>): Observable<Child> {
    return this.http.post<Child>(`${this.API_URL}/parents/children`, child);
  }

  updateChild(id: string, child: Partial<Child>): Observable<Child> {
    return this.http.put<Child>(
      `${this.API_URL}/parents/children/${id}`,
      child
    );
  }

  deleteChild(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/parents/children/${id}`);
  }

  // Tasks endpoints
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API_URL}/parents/tasks`);
  }

  addTask(
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}/parents/tasks`, task);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/parents/tasks/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/parents/tasks/${id}`);
  }

  // Behavior endpoints
  getBehaviorRecords(childId: string): Observable<BehaviorRecord[]> {
    return this.http.get<BehaviorRecord[]>(
      `${this.API_URL}/parents/children/${childId}/behavior`
    );
  }

  addBehaviorRecord(
    childId: string,
    record: Omit<BehaviorRecord, 'id'>
  ): Observable<BehaviorRecord> {
    return this.http.post<BehaviorRecord>(
      `${this.API_URL}/parents/children/${childId}/behavior`,
      record
    );
  }

  // Calendar endpoints
  getCalendarEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.API_URL}/parents/calendar`);
  }

  addCalendarEvent(
    event: Omit<CalendarEvent, 'id'>
  ): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(
      `${this.API_URL}/parents/calendar`,
      event
    );
  }

  updateCalendarEvent(
    id: string,
    event: Partial<CalendarEvent>
  ): Observable<CalendarEvent> {
    return this.http.put<CalendarEvent>(
      `${this.API_URL}/parents/calendar/${id}`,
      event
    );
  }

  deleteCalendarEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/parents/calendar/${id}`);
  }

  // Educational resources
  getEducationalResources(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/parents/resources`);
  }
}
