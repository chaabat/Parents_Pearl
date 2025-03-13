import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reward } from '../models/reward.model';
 
import { environment } from '../../../environments/environment';
import { Child, ChildResponse } from '../models/child.model';
import {  Task, TaskAnswer } from '../models/task.model';
import { Point } from '../models/point.model';
import { RewardRedemption } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ChildService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

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

  // Child Profile endpoints
  getChildProfile(childId: number): Observable<ChildResponse> {
    return this.http.get<ChildResponse>(
      `${this.apiUrl}/children/${childId}/profile`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Task endpoints
  getMyTasks(childId: number): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${this.apiUrl}/children/${childId}/my-tasks`,
      { headers: this.getAuthHeaders() }
    );
  }

  completeTask(childId: number, taskId: number): Observable<Task> {
    return this.http.post<Task>(
      `${this.apiUrl}/children/${childId}/tasks/${taskId}/complete`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  viewMyTask(childId: number, taskId: number): Observable<Task> {
    return this.http.get<Task>(
      `${this.apiUrl}/children/${childId}/tasks/${taskId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  searchMyTasks(childId: number, keyword: string): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${this.apiUrl}/children/${childId}/tasks/search`,
      { params: { keyword }, headers: this.getAuthHeaders() }
    );
  }

  submitTaskAnswer(childId: number, taskId: number, answer: string): Observable<TaskAnswer> {
    return this.http.post<TaskAnswer>(
      `${this.apiUrl}/children/${childId}/tasks/${taskId}/submit`,
      answer,
      { headers: this.getAuthHeaders() }
    );
  }

  getChildTasks(childId: number): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${this.apiUrl}/children/${childId}/tasks`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Points endpoints
  getMyPointHistory(childId: number): Observable<Point[]> {
    return this.http.get<Point[]>(
      `${this.apiUrl}/points/children/${childId}/points`,
      { headers: this.getAuthHeaders() }
    );
  }

  getMyTotalPoints(childId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/points/children/${childId}/points/total`,
      { headers: this.getAuthHeaders() }
    );
  }

  getPointHistory(childId: number): Observable<Point[]> {
    return this.http.get<Point[]>(
      `${this.apiUrl}/children/${childId}/points/history`,
      { headers: this.getAuthHeaders() },
       
    );
  }

  getTotalPoints(childId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/children/${childId}/points/total`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Reward endpoints
  redeemReward(
    childId: number,
    request: RewardRedemption
  ): Observable<RewardRedemption> {
    return this.http.post<RewardRedemption>(
      `${this.apiUrl}/children/${childId}/rewards/redeem`,
      request,
      { headers: this.getAuthHeaders() }
    );
  }

  getAvailableRewards(childId: number): Observable<Reward[]> {
    return this.http.get<Reward[]>(
      `${this.apiUrl}/children/${childId}/rewards`,
      { headers: this.getAuthHeaders() }
    );
  }

  getRedemptionHistory(
    childId: number
  ): Observable<RewardRedemption[]> {
    return this.http.get<RewardRedemption[]>(
      `${this.apiUrl}/children/${childId}/rewards/history`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Additional endpoints
  getChildDetails(childId: number): Observable<Child> {
    return this.http.get<Child>(`${this.apiUrl}/children/${childId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}