import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Child, Task, Reward, Point, Parent } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ParentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Profile Management
  getParentProfile(parentId: number): Observable<Parent> {
    return this.http.get<Parent>(`${this.apiUrl}/parents/${parentId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateParentProfile(
    parentId: number,
    profileData: Partial<Parent>
  ): Observable<Parent> {
    return this.http.put<Parent>(
      `${this.apiUrl}/parents/${parentId}`,
      profileData,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteParentAccount(parentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/parents/${parentId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // parent.service.ts
  getMyChildren(parentId: number): Observable<Child[]> {
    const token = localStorage.getItem('token');
    console.log('Service - Token when fetching children:', token);

    // Create explicit headers
    const headers = this.getAuthHeaders();

    console.log('Service - Headers:', headers);

    return this.http.get<Child[]>(
      `${this.apiUrl}/parents/${parentId}/children`,
      { headers: headers }
    );
  }

  updateChild(
    parentId: number,
    childId: number,
    child: Partial<Child>
  ): Observable<Child> {
    return this.http.put<Child>(
      `${this.apiUrl}/parents/${parentId}/children/${childId}`,
      child,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteChild(parentId: number, childId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/parents/${parentId}/children/${childId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Task Management
  createTask(
    parentId: number,
    childId: number,
    task: Partial<Task>
  ): Observable<Task> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<Task>(
      `${this.apiUrl}/parents/${parentId}/children/${childId}/tasks`,
      task,
      { headers }
    );
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  updateTask(
    parentId: number,
    childId: number,
    taskId: number,
    task: Partial<Task>
  ): Observable<Task> {
    return this.http.put<Task>(
      `${this.apiUrl}/parents/${parentId}/children/${childId}/tasks/${taskId}`,
      task,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteTask(
    parentId: number,
    childId: number,
    taskId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/parents/${parentId}/children/${childId}/tasks/${taskId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Points Management
  getChildPointHistory(parentId: number, childId: number): Observable<Point[]> {
    return this.http.get<Point[]>(
      `${this.apiUrl}/points/parents/${parentId}/children/${childId}/points`,
      {
        headers: this.getAuthHeaders(),
        params: {
          sort: 'createdAt,desc',
        },
      }
    );
  }

  // Rewards Management
  createReward(parentId: number, reward: Partial<Reward>): Observable<Reward> {
    return this.http.post<Reward>(
      `${this.apiUrl}/parents/${parentId}/rewards`,
      reward,
      { headers: this.getAuthHeaders() }
    );
  }

  updateReward(
    parentId: number,
    rewardId: number,
    reward: Partial<Reward>
  ): Observable<Reward> {
    return this.http.put<Reward>(
      `${this.apiUrl}/parents/${parentId}/rewards/${rewardId}`,
      reward,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteReward(parentId: number, rewardId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/parents/${parentId}/rewards/${rewardId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getAllRewards(parentId: number): Observable<Reward[]> {
    return this.http.get<Reward[]>(
      `${this.apiUrl}/parents/${parentId}/rewards`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Child Management
  addChild(parentId: number, child: any): Observable<Child> {
    return this.http.post<Child>(
      `${this.apiUrl}/parents/${parentId}/children`,
      child,
      { headers: this.getAuthHeaders() }
    );
  }

  editChild(parentId: number, childId: number, child: any): Observable<Child> {
    return this.http.put<Child>(
      `${this.apiUrl}/parents/${parentId}/children/${childId}`,
      child,
      { headers: this.getAuthHeaders() }
    );
  }

  addPoints(
    parentId: number,
    childId: number,
    points: number,
    reason: string
  ): Observable<any> {
    // Create URLSearchParams for form data
    const params = new URLSearchParams();
    params.append('points', Math.round(points).toString()); // Ensure it's a whole number
    params.append('reason', reason);

    return this.http.post(
      `${this.apiUrl}/parents/${parentId}/children/${childId}/points`,
      params.toString(),
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      }
    );
  }

  getTasks(parentId: number): Observable<Task[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<Task[]>(`${this.apiUrl}/parents/${parentId}/tasks`, {
      headers,
    });
  }
}
