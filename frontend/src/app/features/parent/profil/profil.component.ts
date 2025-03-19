import {
  Component,
   OnInit,
  ViewChild,
   ElementRef,
   TemplateRef,
   OnDestroy,
  Inject,
  forwardRef,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import { MaterialModule } from "../../../shared/material.module"
import { ReactiveFormsModule,  FormBuilder,  FormGroup, Validators,  AbstractControl } from "@angular/forms"
import  { Store } from "@ngrx/store"
import {  Observable, of, Subject } from "rxjs"
import { map, catchError, takeUntil } from "rxjs/operators"
import {  HttpClient, HttpHeaders } from "@angular/common/http"
import {  MatDialog, MatDialogModule } from "@angular/material/dialog"
import  { MatSnackBar } from "@angular/material/snack-bar"
import  { Router, ActivatedRoute } from "@angular/router"
import * as ParentActions from "../../../store/parent/parent.actions"
import * as ParentSelectors from "../../../store/parent/parent.selectors"
import * as AuthSelectors from "../../../store/auth/auth.selectors"
import * as AuthActions from "../../../store/auth/auth.actions"
import { environment } from "../../../../environments/environment"
import  { ParentService } from "../../../core/services/parent.service"
import  { AdminService } from "../../../core/services/admin.service"
import { Role } from "../../../core/models/user.model"

@Component({
  selector: "app-profil",
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: "./profil.component.html",
  styleUrls: ["./profil.component.css"],
})
export class ProfilComponent implements OnInit, OnDestroy {
  @ViewChild("fileInputEdit") fileInput!: ElementRef
  @ViewChild("deleteConfirmDialog") deleteConfirmDialog!: TemplateRef<any>

  private destroy$ = new Subject<void>()

  profileForm: FormGroup
  userId: number | null = null
  userRole: string | null = null
  selectedFile: File | null = null
  imagePreview: string | null = null
  parent$ = this.store.select(ParentSelectors.selectParentProfile)
  loading$ = this.store.select(ParentSelectors.selectParentLoading)
  error$ = this.store.select(ParentSelectors.selectParentError)
  originalProfile: any = null
  isLoading = false
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private http: HttpClient,
    private parentService: ParentService,
    @Inject(forwardRef(() => AdminService)) private adminService: AdminService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.profileForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ["", [Validators.required, Validators.email]],
      dateOfBirth: [""],
      picture: [""],
      password: ["", [this.passwordValidator]],
    })
  }

  // Password validator - either empty or meets requirements
  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value
    if (!value) return null // Empty is valid

    // At least 6 characters, with at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(value)
    const hasNumber = /[0-9]/.test(value)
    const isLongEnough = value.length >= 6

    if (!hasLetter || !hasNumber || !isLongEnough) {
      return { invalidPassword: true }
    }

    return null
  }

  ngOnInit(): void {
    // Clear admin profile cache to ensure fresh data on load
    this.adminService.clearAdminProfileCache()

    // Load current user's profile
    this.store
      .select(AuthSelectors.selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user?.id) {
          this.userId = user.id
          this.userRole = user.role

          // Check and fix the route if needed
          this.checkAndFixRoute()

          // Handle different roles
          if (user.role === Role.ADMIN) {
            // For admin users, use the admin service
            this.loadAdminProfile(user.id)
          } else if (user.role === Role.PARENT) {
            // For parent users, use the parent service via Redux
            this.store.dispatch(ParentActions.loadParentProfile({ parentId: user.id }))

            // Subscribe to profile data changes for parents
            this.parent$.pipe(takeUntil(this.destroy$)).subscribe((parent) => {
              if (parent) {
                this.updateFormWithProfileData(parent)
              }
            })
          }
        }
      })
  }

  checkAndFixRoute(): void {
    if (this.userRole === Role.ADMIN && this.router.url.includes("/parent/")) {
      // Redirect admin users to the admin profile route
      this.router.navigate(["/admin/profil"])
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  // Get image URL helper
  getImageUrl(picture: string | undefined | null): string {
    if (!picture) {
      return "https://res.cloudinary.com/dlwyetxjd/image/upload/v1741440913/qlmeun5wapfrgn5btfur.png"
    }

    // Check if the picture is already a full URL
    if (picture.startsWith("http")) {
      return picture
    }

    // Get the base URL without the /api suffix
    const baseUrl = environment.apiUrl.endsWith("/api")
      ? environment.apiUrl.substring(0, environment.apiUrl.length - 4)
      : environment.apiUrl

    // Return the full URL to the image
    return `${baseUrl}/uploads/images/${picture}`
  }

  // Load admin profile
  loadAdminProfile(adminId: number): void {
    this.isLoading = true
    this.errorMessage = null

    this.adminService.getAdminProfile(adminId).subscribe({
      next: (profile) => {
        this.isLoading = false
        this.updateFormWithProfileData(profile)
      },
      error: (error) => {
        this.isLoading = false
        console.error("Error loading admin profile:", error)
        this.errorMessage = "Failed to load profile. Please try again later."
        this.snackBar.open("Failed to load profile", "Close", {
          duration: 5000,
          panelClass: ["error-snackbar"],
        })
      },
    })
  }

  // Update form with profile data
  updateFormWithProfileData(profile: any): void {
    // Store original profile for comparison
    this.originalProfile = { ...profile }

    // Update form with current values
    this.profileForm.patchValue(
      {
        name: profile.name || "",
        email: profile.email || "",
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : new Date("1970-01-01"),
        picture: profile.picture || "",
        password: "",
      },
      { emitEvent: false },
    )

    if (profile.picture) {
      this.imagePreview = this.getImageUrl(profile.picture)
    }

    // Mark form as pristine after loading data
    this.profileForm.markAsPristine()
  }

  // Form submission
  onSubmit(): void {
    if (this.profileForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.profileForm)
      return
    }

    if (this.userId) {
      const formValue = this.profileForm.value
      const updateData: any = {
        name: formValue.name,
        email: formValue.email,
        dateOfBirth: formValue.dateOfBirth || new Date("1970-01-01"), // Always include dateOfBirth
      }

      // Only include password if it was changed
      if (formValue.password) {
        updateData.password = formValue.password
      }

      // Handle image upload if there's a new file
      if (this.selectedFile) {
        this.isLoading = true
        this.uploadImage().subscribe({
          next: (imageUrl) => {
            if (imageUrl) {
              updateData.picture = imageUrl
            }
            this.updateUserProfile(updateData)
          },
          error: (error) => {
            console.error("Image upload failed:", error)
            this.isLoading = false
            this.snackBar.open("Failed to upload image", "Close", {
              duration: 5000,
              panelClass: ["error-snackbar"],
            })
            // Continue with update without the new image
            this.updateUserProfile(updateData)
          },
        })
      } else {
        this.updateUserProfile(updateData)
      }
    }
  }

  // Mark all form controls as touched to trigger validation
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched()
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup)
      }
    })
  }

  // Update user profile based on role
  updateUserProfile(updateData: any): void {
    if (!this.userId) return

    this.isLoading = true
    this.errorMessage = null

    if (this.userRole === Role.ADMIN) {
      // For admin users, use the admin service directly
      this.adminService.updateAdminProfile(this.userId, updateData).subscribe({
        next: (updatedProfile) => {
          this.isLoading = false

          // Update the form with the updated profile
          this.updateFormWithProfileData(updatedProfile)

          // Update auth state to reflect changes in navbar immediately
          const updatedUser = {
            ...this.originalProfile,
            name: updateData.name,
            email: updateData.email,
            picture: updateData.picture || this.originalProfile.picture,
            dateOfBirth: updateData.dateOfBirth,
          }

          // Update localStorage to ensure persistence
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
          const updatedLocalUser = {
            ...currentUser,
            name: updateData.name,
            email: updateData.email,
            picture: updateData.picture || this.originalProfile.picture,
          }
          localStorage.setItem("user", JSON.stringify(updatedLocalUser))

          // Dispatch proper auth action to update user in store
          this.store.dispatch(AuthActions.updateUser({ user: updatedUser }))

          this.snackBar.open("Profile updated successfully", "Close", {
            duration: 3000,
            panelClass: ["success-snackbar"],
          })
        },
        error: (error) => {
          this.isLoading = false
          console.error("Error updating admin profile:", error)
          this.errorMessage = "Failed to update profile"
          this.snackBar.open("Failed to update profile", "Close", {
            duration: 5000,
            panelClass: ["error-snackbar"],
          })
        },
      })
    } else if (this.userRole === Role.PARENT) {
      // Update parent profile using Redux
      this.store.dispatch(
        ParentActions.updateParentProfile({
          parentId: this.userId,
          profileData: updateData,
        }),
      )

      // Update auth state to reflect changes in navbar immediately
      const updatedUser = {
        ...this.originalProfile,
        name: updateData.name,
        email: updateData.email,
        picture: updateData.picture || this.originalProfile.picture,
        dateOfBirth: updateData.dateOfBirth,
      }

      // Update localStorage to ensure persistence
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
      const updatedLocalUser = {
        ...currentUser,
        name: updateData.name,
        email: updateData.email,
        picture: updateData.picture || this.originalProfile.picture,
      }
      localStorage.setItem("user", JSON.stringify(updatedLocalUser))

      // Dispatch proper auth action to update user in store
      this.store.dispatch(AuthActions.updateUser({ user: updatedUser }))

      this.isLoading = false
      this.snackBar.open("Profile updated successfully", "Close", {
        duration: 3000,
        panelClass: ["success-snackbar"],
      })
    }
  }

  // Handle image errors
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement
    img.src = "https://res.cloudinary.com/dlwyetxjd/image/upload/v1741440913/qlmeun5wapfrgn5btfur.png"
  }

  // Handle file selection
  onFileSelected(event: any) {
    const file = event.target.files[0]
    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png", "image/gif"]
      if (!validTypes.includes(file.type)) {
        this.snackBar.open("Please select a valid image file (JPEG, PNG, or GIF)", "Close", {
          duration: 5000,
          panelClass: ["error-snackbar"],
        })
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open("Image size should not exceed 5MB", "Close", {
          duration: 5000,
          panelClass: ["error-snackbar"],
        })
        return
      }

      this.selectedFile = file

      // Create a preview
      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result as string
      }
      reader.readAsDataURL(file)

      // Update form value and mark as dirty
      this.profileForm.patchValue({
        picture: file.name,
      })
      this.profileForm.markAsDirty()
    }
  }

  // Upload image
  uploadImage(): Observable<string> {
    if (!this.selectedFile) {
      return of("")
    }

    const formData = new FormData()
    formData.append("file", this.selectedFile)

    // Get the authentication token
    const token = localStorage.getItem("token")
    if (!token) {
      return of("")
    }

    // Create headers with authentication
    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)

    // Use the API endpoint for uploads
    const uploadUrl = `${environment.apiUrl}/uploads/images`

    return this.http
      .post<any>(uploadUrl, formData, {
        headers,
        responseType: "text" as "json",
      })
      .pipe(
        map((response) => {
          if (typeof response === "string") {
            return response
          } else if (response && response.imageUrl) {
            return response.imageUrl
          }
          return ""
        }),
        catchError((error) => {
          console.error("Image upload error:", error)
          return of("")
        }),
      )
  }

  // Trigger file input click
  triggerFileInput(): void {
    this.fileInput.nativeElement.click()
  }

  // Open delete confirmation dialog
  openDeleteConfirmDialog(): void {
    this.dialog.open(this.deleteConfirmDialog, {
      width: "400px",
    })
  }

  // Confirm account deletion
  confirmDelete(): void {
    if (!this.userId) return

    this.isLoading = true

    if (this.userRole === Role.PARENT) {
      this.parentService.deleteParentAccount(this.userId).subscribe({
        next: () => {
          this.isLoading = false
          // Clear local storage and navigate to login
          localStorage.clear()
          this.router.navigate(["/auth/login"])
          this.snackBar.open("Account deleted successfully", "Close", {
            duration: 3000,
          })
        },
        error: (error) => {
          this.isLoading = false
          console.error("Error deleting account:", error)
          this.snackBar.open("Failed to delete account", "Close", {
            duration: 5000,
            panelClass: ["error-snackbar"],
          })
        },
      })
    }
  }

  // Get error message for form controls
  getErrorMessage(controlName: string): string {
    const control = this.profileForm.get(controlName)
    if (!control || !control.errors || !control.touched) return ""

    if (control.errors["required"]) return "This field is required"
    if (control.errors["email"]) return "Please enter a valid email address"
    if (control.errors["minlength"]) return `Minimum ${control.errors["minlength"].requiredLength} characters required`
    if (control.errors["maxlength"]) return `Maximum ${control.errors["maxlength"].requiredLength} characters allowed`
    if (control.errors["invalidPassword"])
      return "Password must be at least 6 characters with at least one letter and one number"
    if (control.errors["passwordMismatch"]) return "Passwords do not match"

    return "Invalid input"
  }
}

