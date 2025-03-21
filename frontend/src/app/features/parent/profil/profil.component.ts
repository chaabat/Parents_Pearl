import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError, takeUntil, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as ParentActions from '../../../store/parent/parent.actions';
import * as ParentSelectors from '../../../store/parent/parent.selectors';
import * as AuthSelectors from '../../../store/auth/auth.selectors';
import * as AuthActions from '../../../store/auth/auth.actions';
import { environment } from '../../../../environments/environment';
import { ParentService } from '../../../core/services/parent.service';
import { AdminService } from '../../../core/services/admin.service';
import { Role } from '../../../core/models/user.model';
import * as AdminActions from '../../../store/admin/admin.actions';
import * as AdminSelectors from '../../../store/admin/admin.selectors';

// Add this validator function at the top level (outside the class)
function ageValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  if (!control.value) return null;

  const birthDate = new Date(control.value);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  // Check if birthday hasn't occurred this year
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    if (age - 1 < 18) return { tooYoung: true };
  } else {
    if (age < 18) return { tooYoung: true };
  }

  return null;
}

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
})
export class ProfilComponent implements OnInit, OnDestroy {
  @ViewChild('fileInputEdit') fileInput!: ElementRef;
  @ViewChild('deleteConfirmDialog') deleteConfirmDialog!: TemplateRef<any>;

  private destroy$ = new Subject<void>();

  profileForm: FormGroup;
  userId: number | null = null;
  userRole: string | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  parent$ = this.store.select(ParentSelectors.selectParentProfile);
  loading$ = this.store.select(ParentSelectors.selectParentLoading);
  error$ = this.store.select(ParentSelectors.selectParentError);
  originalProfile: any = null;
  isLoading = false;
  errorMessage: string | null = null;
  adminProfile$ = this.store.select(AdminSelectors.selectAdminProfile);
  adminLoading$ = this.store.select(AdminSelectors.selectAdminLoading);
  adminError$ = this.store.select(AdminSelectors.selectAdminError);

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private http: HttpClient,
    private parentService: ParentService,
    private adminService: AdminService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', [Validators.required, ageValidator]],
      picture: [''],
      password: ['', [this.passwordValidator]],
    });
  }

  // Password validator - either empty or meets requirements
  passwordValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) return null; // Empty is valid

    // At least 6 characters, with at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const isLongEnough = value.length >= 6;

    if (!hasLetter || !hasNumber || !isLongEnough) {
      return { invalidPassword: true };
    }

    return null;
  }

  ngOnInit(): void {
    // Get user role and ID first
    this.store
      .select(AuthSelectors.selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.userId = user.id;
          this.userRole = user.role;

          // Load profile based on role
          if (this.userRole === Role.PARENT) {
            this.loadParentProfile();
          } else if (this.userRole === Role.ADMIN) {
            this.loadAdminProfile();
          }
        }
      });
  }

  private loadAdminProfile(): void {
    if (!this.userId) return;

    this.store.dispatch(AdminActions.loadAdminProfile({ adminId: this.userId }));

    // Subscribe to admin profile changes
    this.adminProfile$.pipe(takeUntil(this.destroy$)).subscribe(profile => {
      if (profile) {
        this.originalProfile = { ...profile };
        this.profileForm.patchValue({
          name: profile.name,
          email: profile.email,
          dateOfBirth: profile.dateOfBirth,
          picture: profile.picture || null,
        });
      }
    });
  }

  private loadParentProfile(): void {
    if (!this.userId) return;

    // Dispatch action to load parent profile
    this.store.dispatch(
      ParentActions.loadParentProfile({ parentId: this.userId })
    );

    // Subscribe to parent profile changes
    this.parent$.pipe(takeUntil(this.destroy$)).subscribe((profile) => {
      if (profile) {
        this.originalProfile = { ...profile };
        this.profileForm.patchValue({
          name: profile.name,
          email: profile.email,
          dateOfBirth: profile.dateOfBirth,
          picture: profile.picture || null,
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Get image URL helper
  getImageUrl(picture: string | undefined | null): string {
    if (!picture) {
      return 'https://res.cloudinary.com/dlwyetxjd/image/upload/v1741440913/qlmeun5wapfrgn5btfur.png';
    }

    // Check if the picture is already a full URL
    if (picture.startsWith('http')) {
      return picture;
    }

    // Get the base URL without the /api suffix
    const baseUrl = environment.apiUrl.endsWith('/api')
      ? environment.apiUrl.substring(0, environment.apiUrl.length - 4)
      : environment.apiUrl;

    // Return the full URL to the image
    return `${baseUrl}/uploads/images/${picture}`;
  }

  // Form submission
  onSubmit(): void {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;

      if (this.userRole === Role.PARENT) {
        this.submitParentProfile(formData);
      } else if (this.userRole === Role.ADMIN) {
        this.submitAdminProfile(formData);
      }
    }
  }

  private submitAdminProfile(formData: any): void {
    if (!this.userId) return;

    // Check if email or password is being changed
    const isEmailChanged = formData.email !== this.originalProfile.email;
    const isPasswordChanged = formData.password && formData.password.trim().length > 0;

    this.adminService.updateAdminProfile(this.userId, formData).pipe(
      tap(() => {
        this.snackBar.open('Profile updated successfully', 'Close', {
          duration: 3000,
        });

        // If email or password changed, show message and logout
        if (isEmailChanged || isPasswordChanged) {
          this.snackBar.open(
            'Your credentials have been updated. Please login again.',
            'Close',
            { duration: 5000 }
          );
          
          // Short delay before logout to allow user to read the message
          setTimeout(() => {
            this.store.dispatch(AuthActions.logout());
          }, 2000);
        }
      }),
      catchError(error => {
        this.snackBar.open('Failed to update profile', 'Close', {
          duration: 3000,
        });
        throw error;
      })
    ).subscribe();
  }

  private submitParentProfile(formData: any): void {
    if (!this.userId) return;

    const updateData: any = {
      name: formData.name,
      email: formData.email,
      dateOfBirth: formData.dateOfBirth,
    };

    if (formData.password) {
      updateData.password = formData.password;
    }

    if (this.selectedFile) {
      this.uploadImage().subscribe({
        next: (imageUrl) => {
          if (imageUrl) {
            updateData.picture = imageUrl;
          }
          this.store.dispatch(
            ParentActions.updateParentProfile({
              parentId: this.userId!,
              profileData: updateData,
            })
          );
        },
        error: (error) => {
          console.error('Image upload failed:', error);
          // Continue with update without the new image
          this.store.dispatch(
            ParentActions.updateParentProfile({
              parentId: this.userId!,
              profileData: updateData,
            })
          );
        },
      });
    } else {
      this.store.dispatch(
        ParentActions.updateParentProfile({
          parentId: this.userId!,
          profileData: updateData,
        })
      );
    }
  }

  // Mark all form controls as touched to trigger validation
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  // Handle image errors
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src =
      'https://res.cloudinary.com/dlwyetxjd/image/upload/v1741440913/qlmeun5wapfrgn5btfur.png';
  }

  // Handle file selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        this.snackBar.open(
          'Please select a valid image file (JPEG, PNG, or GIF)',
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
          }
        );
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('Image size should not exceed 5MB', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        return;
      }

      this.selectedFile = file;

      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Update form value and mark as dirty
      this.profileForm.patchValue({
        picture: file.name,
      });
      this.profileForm.markAsDirty();
    }
  }

  // Upload image
  uploadImage(): Observable<string> {
    if (!this.selectedFile) {
      return of('');
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // Get the authentication token
    const token = localStorage.getItem('token');
    if (!token) {
      return of('');
    }

    // Create headers with authentication
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Use the API endpoint for uploads
    const uploadUrl = `${environment.apiUrl}/uploads/images`;

    return this.http
      .post<any>(uploadUrl, formData, {
        headers,
        responseType: 'text' as 'json',
      })
      .pipe(
        map((response) => {
          if (typeof response === 'string') {
            return response;
          } else if (response && response.imageUrl) {
            return response.imageUrl;
          }
          return '';
        }),
        catchError((error) => {
          console.error('Image upload error:', error);
          return of('');
        })
      );
  }

  // Trigger file input click
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  // Open delete confirmation dialog
  openDeleteConfirmDialog(): void {
    this.dialog.open(this.deleteConfirmDialog, {
      width: '400px',
    });
  }

  // Confirm account deletion
  confirmDelete(): void {
    if (!this.userId) return;

    this.isLoading = true;

    if (this.userRole === Role.PARENT) {
      this.parentService.deleteParentAccount(this.userId).subscribe({
        next: () => {
          this.isLoading = false;
          // Clear local storage and navigate to login
          localStorage.clear();
          this.router.navigate(['/auth/login']);
          this.snackBar.open('Account deleted successfully', 'Close', {
            duration: 3000,
          });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error deleting account:', error);
          this.snackBar.open('Failed to delete account', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
    }
  }

  // Update getErrorMessage to include age validation error
  getErrorMessage(controlName: string): string {
    const control = this.profileForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'This field is required';
    if (control.errors['email']) return 'Please enter a valid email address';
    if (control.errors['minlength'])
      return `Minimum ${control.errors['minlength'].requiredLength} characters required`;
    if (control.errors['maxlength'])
      return `Maximum ${control.errors['maxlength'].requiredLength} characters allowed`;
    if (control.errors['tooYoung']) return 'You must be at least 18 years old';
    if (control.errors['invalidPassword'])
      return 'Password must be at least 6 characters with at least one letter and one number';
    if (control.errors['passwordMismatch']) return 'Passwords do not match';

    return 'Invalid input';
  }
}
