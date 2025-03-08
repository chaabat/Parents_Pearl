import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    return this.http.get<Parent>(`${this.apiUrl}/parents/${parentId}`);
  }

  updateParentProfile(
    parentId: number,
    profileData: Partial<Parent>
  ): Observable<Parent> {
    return this.http.put<Parent>(
      `${this.apiUrl}/parents/${parentId}`,
      profileData
    );
  }

  // parent.service.ts
  getMyChildren(parentId: number): Observable<Child[]> {
    const token = localStorage.getItem('token');
    console.log('Service - Token when fetching children:', token);

    // Create explicit headers
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

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
      child
    );
  }

  deleteChild(parentId: number, childId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/parents/${parentId}/children/${childId}`
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
  updateChildPoints(
    parentId: number,
    childId: number,
    points: number,
    reason: string
  ): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/parents/${parentId}/children/${childId}/points`,
      { points, reason }
    );
  }

  getChildPointHistory(parentId: number, childId: number): Observable<Point[]> {
    return this.http.get<Point[]>(
      `${this.apiUrl}/parents/${parentId}/children/${childId}/points/child-history`
    );
  }

  awardPoints(
    parentId: number,
    childId: number,
    points: number,
    reason: string
  ): Observable<Point> {
    return this.http.post<Point>(
      `${this.apiUrl}/parents/${parentId}/children/${childId}/points`,
      { points, reason }
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

  addChild(parentId: number, child: any): Observable<Child> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<Child>(
      `${this.apiUrl}/parents/${parentId}/children`,
      child,
      { headers }
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
