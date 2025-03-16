import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reward } from '../models/reward.model';
import { tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Child, ChildResponse } from '../models/child.model';
import { Task, TaskAnswer } from '../models/task.model';
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
    console.log('Fetching child profile for:', childId);
    return this.http
      .get<ChildResponse>(`${this.apiUrl}/children/${childId}/profile`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(tap((profile) => console.log('Received profile:', profile)));
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

  submitTaskAnswer(
    childId: number,
    taskId: number,
    answer: string
  ): Observable<TaskAnswer> {
    return this.http.post<TaskAnswer>(
      `${this.apiUrl}/children/${childId}/tasks/${taskId}/submit`,
      answer,
      { headers: this.getAuthHeaders() }
    );
  }

  getChildTasks(childId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/children/${childId}/tasks`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Points endpoints
  getMyPointHistory(childId: number): Observable<Point[]> {
    return this.http.get<Point[]>(
      `${this.apiUrl}/children/${childId}/points/history`,
      { headers: this.getAuthHeaders() }
    );
  }

  getMyTotalPoints(childId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/children/${childId}/points/total`,
      { headers: this.getAuthHeaders() }
    );
  }

  getPointHistory(childId: number): Observable<Point[]> {
    return this.http.get<Point[]>(
      `${this.apiUrl}/children/${childId}/points/history`,
      { headers: this.getAuthHeaders() }
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
    rewardId: number
  ): Observable<RewardRedemption> {
    console.log(`Attempting to redeem reward ${rewardId} for child ${childId}`);
    const url = `${this.apiUrl}/children/${childId}/rewards/redeem`;
    console.log('Making request to:', url);

    return this.http
      .post<RewardRedemption>(
        url,
        { rewardId },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        tap((response) => {
          console.log('Redemption response:', response);
          if (!response) {
            throw new Error('No response received from redemption request');
          }
        })
      );
  }

  getAvailableRewards(childId: number): Observable<Reward[]> {
    return this.http.get<Reward[]>(
      `${this.apiUrl}/children/${childId}/rewards`,
      { headers: this.getAuthHeaders() }
    );
  }

  getRedemptionHistory(childId: number): Observable<RewardRedemption[]> {
    return this.http.get<RewardRedemption[]>(
      `${this.apiUrl}/children/${childId}/rewards/history`,
      { headers: this.getAuthHeaders() }
    );
  }

  getChildRewards(childId: number): Observable<Reward[]> {
    console.log('Fetching rewards for child:', childId);
    return this.http
      .get<Reward[]>(`${this.apiUrl}/children/${childId}/rewards`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(tap((rewards) => console.log('Received rewards:', rewards)));
  }

  // Additional endpoints
  getChildDetails(childId: number): Observable<Child> {
    return this.http.get<Child>(`${this.apiUrl}/children/${childId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getChildRedemptions(childId: number): Observable<RewardRedemption[]> {
    return this.http
      .get<RewardRedemption[]>(
        `${this.apiUrl}/children/${childId}/rewards/history`,
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        tap((response) => console.log('Redemption history response:', response))
      );
  }
}
