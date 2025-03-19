import { Injectable } from "@angular/core"
import {  HttpClient, HttpHeaders } from "@angular/common/http"
import {  Observable, forkJoin, map, throwError, of, switchMap } from "rxjs"
import { environment } from "../../../environments/environment"
import { tap, catchError } from "rxjs/operators"
import  { Parent } from "../models/parent.model"
import  { Child } from "../models/child.model"
import  { Admin } from "../models/admin.model"

@Injectable({
  providedIn: "root",
})
export class AdminService {
  private apiUrl = environment.apiUrl
  private cachedAdminProfile: any = null

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("No authentication token found")
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    })
  }

  // User Management
  getAllParents(): Observable<Parent[]> {
    return this.http
      .get<Parent[]>(`${this.apiUrl}/admin/parents`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((parents) => console.log("Fetched all parents:", parents)),
        catchError((error) => {
          console.error("Error fetching parents:", error)
          throw error
        }),
      )
  }

  getAllChildren(): Observable<Child[]> {
    return this.http
      .get<Child[]>(`${this.apiUrl}/admin/children`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((children) => console.log("Fetched all children:", children)),
        catchError((error) => {
          console.error("Error fetching children:", error)
          throw error
        }),
      )
  }

  getAllAdmins(): Observable<Admin[]> {
    return this.http
      .get<Admin[]>(`${this.apiUrl}/admin/admins`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(tap((admins) => console.log("Fetched all admins:", admins)))
  }

  // Ban Management
  getBannedUsers(): Observable<any[]> {
    console.log("Fetching banned users...")
    return forkJoin({
      parents: this.http.get<any[]>(`${this.apiUrl}/admin/parents/banned`, {
        headers: this.getAuthHeaders(),
      }),
      children: this.http.get<any[]>(`${this.apiUrl}/admin/children/banned`, {
        headers: this.getAuthHeaders(),
      }),
    }).pipe(
      map(({ parents, children }) => [
        ...parents.map((parent) => ({ ...parent, userType: "parent" })),
        ...children.map((child) => ({ ...child, userType: "child" })),
      ]),
      tap((users) => console.log("Combined banned users:", users)),
      catchError((error) => {
        console.error("Error fetching banned users:", error)
        throw error
      }),
    )
  }

  banUser(userId: number, userType: "parent" | "child"): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/admin/users/${userId}/ban`, {}, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => console.log(`Banned user ${userId}`)),
        catchError((error) => {
          console.error("Error banning user:", error)
          throw error
        }),
      )
  }

  unbanUser(userId: number, userType: "parent" | "child"): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/admin/users/${userId}/unban`, {}, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => console.log(`Unbanned user ${userId}`)),
        catchError((error) => {
          console.error("Error unbanning user:", error)
          throw error
        }),
      )
  }

  // Admin Profile Management
  getAdminProfile(id: number): Observable<Admin> {
    // Return cached profile if available
    if (this.cachedAdminProfile) {
      console.log("Using cached admin profile:", this.cachedAdminProfile)
      return of(this.cachedAdminProfile)
    }

    return this.http
      .get<Admin>(`${this.apiUrl}/admin/profile/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((profile) => {
          console.log("Fetched admin profile:", profile)
          // Cache the profile
          this.cachedAdminProfile = profile
        }),
        catchError((error) => {
          console.error("Error fetching admin profile:", error)
          return throwError(() => error)
        }),
      )
  }

  updateAdminProfile(id: number, data: Partial<Admin>): Observable<Admin> {
    // First, get the current profile to ensure we have all fields
    return this.getAdminProfile(id).pipe(
      switchMap((currentProfile) => {
        // Create update data that preserves the existing password
        const updateData = {
          // Include all fields from the current profile
          ...currentProfile,
          // Override with the updated fields
          name: data.name || currentProfile.name,
          email: data.email || currentProfile.email,
          dateOfBirth: data.dateOfBirth || currentProfile.dateOfBirth,
          picture: data.picture || currentProfile.picture,
          deleted: false,
          role: "ADMIN",
          // IMPORTANT: Keep the existing password unless a new one is provided
          // This ensures we never send NULL for the password field
          password: data.password || currentProfile.password,
        }

        console.log("Updating admin profile with data:", updateData)

        return this.http
          .put<Admin>(`${this.apiUrl}/admin/profile/${id}`, updateData, {
            headers: this.getAuthHeaders(),
          })
          .pipe(
            tap((updated) => {
              console.log("Updated admin profile:", updated)
              // Update the cached profile
              this.cachedAdminProfile = updated
            }),
            catchError((error) => {
              console.error("Error updating admin profile:", error)
              return throwError(() => error)
            }),
          )
      }),
    )
  }

  // Clear the cached admin profile
  clearAdminProfileCache(): void {
    this.cachedAdminProfile = null
    console.log("Admin profile cache cleared")
  }

  // Statistics
  getSystemStats(): Observable<{
    activeUsers: number
    bannedUsers: number
    completedTasks: number
  }> {
    return this.http
      .get<any>(`${this.apiUrl}/admin/stats`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(tap((stats) => console.log("Fetched system stats:", stats)))
  }

  uploadProfilePicture(file: File): Observable<any> {
    const formData: FormData = new FormData()
    formData.append("file", file)
    return this.http.post(`${environment.apiUrl}/uploads/images`, formData)
  }

  getProfilePicture(fileName: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/uploads/images/${fileName}`, { responseType: "blob" })
  }
}

