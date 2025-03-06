import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.get<Parent>(
      `${this.apiUrl}/parents/${parentId}/profile`
    );
  }

  updateParentProfile(
    parentId: number,
    profileData: Partial<Parent>
  ): Observable<Parent> {
    return this.http.put<Parent>(
      `${this.apiUrl}/parents/${parentId}/profile`,
      profileData
    );
  }

  // Children Management
  getMyChildren(parentId: number): Observable<Child[]> {
    return this.http.get<Child[]>(
      `${this.apiUrl}/parents/${parentId}/children`
    );
  }

  addChild(parentId: number, childData: Partial<Child>): Observable<Child> {
    return this.http.post<Child>(
      `${this.apiUrl}/parents/${parentId}/children`,
      childData
    );
  }

  updateChild(
    parentId: number,
    childId: number,
    childData: Partial<Child>
  ): Observable<Child> {
    return this.http.put<Child>(
      `${this.apiUrl}/parents/${parentId}/children/${childId}`,
      childData
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
    taskData: Partial<Task>
  ): Observable<Task> {
    return this.http.post<Task>(
      `${this.apiUrl}/parents/${parentId}/children/${childId}/tasks`,
      taskData
    );
  }

  updateTask(
    parentId: number,
    childId: number,
    taskId: number,
    taskData: Partial<Task>
  ): Observable<Task> {
    return this.http.put<Task>(
      `${this.apiUrl}/parents/${parentId}/children/${childId}/tasks/${taskId}`,
      taskData
    );
  }

  deleteTask(
    parentId: number,
    childId: number,
    taskId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/parents/${parentId}/children/${childId}/tasks/${taskId}`
    );
  }

  // Points Management
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

  getChildPointHistory(
    parentId: number,
    childId: number
  ): Observable<Point[]> {
    return this.http.get<Point[]>(
      `${this.apiUrl}/points/parents/${parentId}/children/${childId}/points/history`
    );
  }

  updateChildPoints(
    parentId: number,
    childId: number,
    points: number
  ): Observable<Child> {
    return this.http.put<Child>(
      `${this.apiUrl}/parents/${parentId}/children/${childId}/points`,
      { points }
    );
  }

  // Rewards Management
  createReward(
    parentId: number,
    rewardData: Partial<Reward>
  ): Observable<Reward> {
    return this.http.post<Reward>(
      `${this.apiUrl}/parents/${parentId}/rewards`,
      rewardData
    );
  }

  updateReward(
    parentId: number,
    rewardId: number,
    rewardData: Partial<Reward>
  ): Observable<Reward> {
    return this.http.put<Reward>(
      `${this.apiUrl}/parents/${parentId}/rewards/${rewardId}`,
      rewardData
    );
  }

  getAllRewards(parentId: number): Observable<Reward[]> {
    return this.http.get<Reward[]>(
      `${this.apiUrl}/parents/${parentId}/rewards`
    );
  }

  deleteReward(parentId: number, rewardId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/parents/${parentId}/rewards/${rewardId}`
    );
  }
}
