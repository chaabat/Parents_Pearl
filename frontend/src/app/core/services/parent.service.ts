import { Injectable } from "@angular/core"
import {  HttpClient, HttpHeaders, HttpParams } from "@angular/common/http"
import {  Observable, tap, catchError, throwError, of, map } from "rxjs"
import { environment } from "../../../environments/environment"
import  { Child, Task, Reward, Point, Parent } from "../models"

@Injectable({
  providedIn: "root",
})
export class ParentService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  // Profile Management
  getParentProfile(parentId: number): Observable<Parent> {
    console.log("Getting profile for parent:", parentId)
    return this.http
      .get<Parent>(`${this.apiUrl}/parents/${parentId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((response) => console.log("Profile response:", response)),
        catchError((error) => {
          console.error("Profile error:", error)
          return throwError(() => error)
        }),
      )
  }

  updateParentProfile(parentId: number, profileData: Partial<Parent>): Observable<Parent> {
    console.log("Updating profile for parent:", parentId, profileData)
    return this.http
      .put<Parent>(`${this.apiUrl}/parents/${parentId}`, profileData, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((response) => console.log("Profile update response:", response)),
        catchError((error) => {
          console.error("Profile update error:", error)
          return throwError(() => error)
        }),
      )
  }

  deleteParentAccount(parentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/parents/${parentId}`, {
      headers: this.getAuthHeaders(),
    })
  }

  // parent.service.ts
  getMyChildren(parentId: number): Observable<Child[]> {
    const token = localStorage.getItem("token")
    console.log("Service - Token when fetching children:", token)

    // Create explicit headers
    const headers = this.getAuthHeaders()

    console.log("Service - Headers:", headers)

    return this.http.get<Child[]>(`${this.apiUrl}/parents/${parentId}/children`, { headers: headers })
  }

  updateChild(parentId: number, childId: number, child: Partial<Child>): Observable<Child> {
    return this.http.put<Child>(`${this.apiUrl}/parents/${parentId}/children/${childId}`, child, {
      headers: this.getAuthHeaders(),
    })
  }

  deleteChild(parentId: number, childId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/parents/${parentId}/children/${childId}`, {
      headers: this.getAuthHeaders(),
    })
  }

  // Task Management
  createTask(parentId: number, childId: number, task: Partial<Task>): Observable<Task> {
    const token = localStorage.getItem("token")
    const headers = this.getAuthHeaders()

    return this.http.post<Task>(`${this.apiUrl}/parents/${parentId}/children/${childId}/tasks`, task, { headers })
  }

  searchTasks(parentId: number, keyword: string): Observable<Task[]> {
    // We know this URL will cause a 500 error, but we'll handle it gracefully
    const url = `${this.apiUrl}/parents/${parentId}/tasks/search?keyword=${encodeURIComponent(keyword)}`
    console.log("Searching tasks with:", { parentId, keyword })

    // Don't log the URL to avoid confusion in the console
    // console.log('Search URL:', url);

    // Use the fallbackToClientSideSearch directly without attempting the server call
    // This avoids the 500 error completely
    console.log("Using client-side search instead of server search")
    return this.fallbackToClientSideSearch(parentId, keyword)

    /* 
    // Original code that attempts server search first (commented out to avoid 500 error)
    return this.http
      .get<Task[]>(url, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((response) => console.log('Search response:', response)),
        catchError((error) => {
          console.error('Search error:', error);
          // Return an empty array instead of throwing an error
          // This allows the app to continue functioning even if search fails
          console.log('Falling back to client-side filtering');
          return this.fallbackToClientSideSearch(parentId, keyword);
        })
      );
    */
  }

  // Fallback method for client-side search when server search fails
  private fallbackToClientSideSearch(parentId: number, keyword: string): Observable<Task[]> {
    return this.getTasks(parentId).pipe(
      map((tasks) => {
        const lowercaseKeyword = keyword.toLowerCase()
        return tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(lowercaseKeyword) ||
            task.description.toLowerCase().includes(lowercaseKeyword),
        )
      }),
      catchError((error) => {
        console.error("Fallback search error:", error)
        return of([])
      }),
    )
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("No authentication token found")
    }
    console.log("Token being used:", token)
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    })
    console.log("Headers being sent:", headers)
    return headers
  }

  updateTask(parentId: number, childId: number, taskId: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/parents/${parentId}/children/${childId}/tasks/${taskId}`, task, {
      headers: this.getAuthHeaders(),
    })
  }

  deleteTask(parentId: number, childId: number, taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/parents/${parentId}/children/${childId}/tasks/${taskId}`, {
      headers: this.getAuthHeaders(),
    })
  }

  // Points Management
  getChildPointHistory(parentId: number, childId: number): Observable<Point[]> {
    return this.http.get<Point[]>(`${this.apiUrl}/points/parents/${parentId}/children/${childId}/points`, {
      headers: this.getAuthHeaders(),
      params: {
        sort: "createdAt,desc",
      },
    })
  }

  // Rewards Management
  createReward(parentId: number, reward: Partial<Reward>): Observable<Reward> {
    return this.http.post<Reward>(`${this.apiUrl}/parents/${parentId}/rewards`, reward, {
      headers: this.getAuthHeaders(),
    })
  }

  updateReward(parentId: number, rewardId: number, reward: Partial<Reward>): Observable<Reward> {
    return this.http.put<Reward>(`${this.apiUrl}/parents/${parentId}/rewards/${rewardId}`, reward, {
      headers: this.getAuthHeaders(),
    })
  }

  deleteReward(parentId: number, rewardId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/parents/${parentId}/rewards/${rewardId}`, {
      headers: this.getAuthHeaders(),
    })
  }

  getAllRewards(parentId: number): Observable<Reward[]> {
    return this.http.get<Reward[]>(`${this.apiUrl}/parents/${parentId}/rewards`, { headers: this.getAuthHeaders() })
  }

  // Child Management
  addChild(parentId: number, child: any): Observable<Child> {
    return this.http.post<Child>(`${this.apiUrl}/parents/${parentId}/children`, child, {
      headers: this.getAuthHeaders(),
    })
  }

  editChild(parentId: number, childId: number, child: any): Observable<Child> {
    return this.http.put<Child>(`${this.apiUrl}/parents/${parentId}/children/${childId}`, child, {
      headers: this.getAuthHeaders(),
    })
  }

  addPoints(parentId: number, childId: number, points: number, reason: string): Observable<any> {
    // Create URLSearchParams for form data
    const params = new URLSearchParams()
    params.append("points", Math.round(points).toString()) // Ensure it's a whole number
    params.append("reason", reason)

    return this.http.post(`${this.apiUrl}/parents/${parentId}/children/${childId}/points`, params.toString(), {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      }),
    })
  }

  getTasks(parentId: number, status?: string): Observable<Task[]> {
    let params = new HttpParams()
    if (status && status !== "ALL") {
      params = params.set("status", status)
    }

    return this.http.get<Task[]>(`${this.apiUrl}/parents/${parentId}/tasks`, {
      headers: this.getAuthHeaders(),
      params, // Add the query parameters
    })
  }

  // Task Management
  completeTask(parentId: number, childId: number, taskId: number): Observable<Task> {
    return this.http.post<Task>(
      `${this.apiUrl}/children/${childId}/tasks/${taskId}/complete`,
      {},
      { headers: this.getAuthHeaders() },
    )
  }

  // Update the uploadParentPicture method to use the correct endpoint
  uploadParentPicture(file: File, parentId: number): Observable<any> {
    const formData: FormData = new FormData()
    formData.append("file", file)

    // Use the API endpoint for uploads
    const uploadUrl = `${environment.apiUrl}/uploads/images`

    console.log("Uploading parent picture to:", uploadUrl)

    return this.http
      .post(uploadUrl, formData, {
        headers: new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem("token")}`),
        responseType: "text",
      })
      .pipe(
        tap((response) => console.log("Upload response:", response)),
        catchError((error) => {
          console.error("Upload error:", error)
          return throwError(() => error)
        }),
      )
  }

  // Update the getParentPicture method to use the correct path
  getParentPicture(fileName: string): Observable<Blob> {
    // Use the correct URL for accessing uploaded images
    const imageUrl = `${environment.apiUrl.replace("/api", "")}/uploads/images/${fileName}`
    console.log("Getting parent picture from:", imageUrl)

    return this.http.get(imageUrl, { responseType: "blob" })
  }
}

