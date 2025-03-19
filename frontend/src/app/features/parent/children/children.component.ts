import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { of } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';

import { Child, Role } from '../../../core/models';
import * as ParentActions from '../../../store/parent/parent.actions';
import * as ParentSelectors from '../../../store/parent/parent.selectors';
import * as AuthSelectors from '../../../store/auth/auth.selectors';
import { ParentService } from '../../../core/services/parent.service';
import { DialogData } from '../../../core/models/child.model';

function ageValidator(minAge: number, maxAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < minAge || age > maxAge) {
      return {
        ageRange: {
          min: minAge,
          max: maxAge,
          actual: age,
        },
      };
    }
    return null;
  };
}

type StatusBadgeType = 'Superstar' | 'Rising Star' | 'Good Start' | 'Beginner';

@Component({
  selector: 'app-children',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatSliderModule,
  ],
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.scss'],
})
export class ChildrenComponent implements OnInit, OnDestroy {
  children$: Observable<Child[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  parentId: number | undefined;
  childForm: FormGroup;
  pointsForm: FormGroup;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  pointHistory$: Observable<any[]>;
  selectedChild: Child | null = null;

  // Status badges with colors
  statusBadges: Record<StatusBadgeType, string> = {
    Superstar: 'bg-green-500',
    'Rising Star': 'bg-blue-500',
    'Good Start': 'bg-yellow-500',
    Beginner: 'bg-gray-500',
  };

  // For cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpClient,
    private parentService: ParentService
  ) {
    this.children$ = this.store.select(ParentSelectors.selectChildren);
    this.loading$ = this.store.select(ParentSelectors.selectParentLoading);
    this.error$ = this.store.select(ParentSelectors.selectParentError);
    this.pointHistory$ = this.store.select(ParentSelectors.selectPointHistory);

    // Initialize forms
    this.childForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      dateOfBirth: ['', [Validators.required, ageValidator(6, 18)]],
      picture: [''],
      role: [Role.CHILD],
      totalPoints: [0],
      tasks: [[]],
      points: [[]],
      rewardRedemptions: [[]],
    });

    this.pointsForm = this.fb.group({
      points: [
        0,
        [Validators.required, Validators.min(-100), Validators.max(100)],
      ],
      reason: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    // Get parent ID and load children
    this.store
      .select(AuthSelectors.selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          if (user?.id) {
            this.parentId = user.id;
            this.store.dispatch(
              ParentActions.loadChildren({ parentId: user.id })
            );
          }
        },
        error: (error) => {
          console.error('Error getting user:', error);
        },
      });

    // Subscribe to children updates
    this.children$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (children) => {
        console.log('Children updated:', children);
      },
      error: (error) => {
        console.error('Error loading children:', error);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openAddChildDialog(addDialog: TemplateRef<any>): void {
    // Reset form and file data
    this.childForm.reset({
      name: '',
      email: '',
      password: '',
      dateOfBirth: null,
      picture: '',
      role: Role.CHILD,
      totalPoints: 0,
      tasks: [],
      points: [],
      rewardRedemptions: [],
    });

    this.selectedFile = null;
    this.imagePreview = null;

    const dialogData: DialogData = {
      title: 'Add New Child',
      submitText: 'Add Child',
      form: this.childForm,
    };

    const dialogRef = this.dialog.open(addDialog, {
      width: '600px',
      panelClass: 'custom-dialog',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.parentId) {
        this.store.dispatch(
          ParentActions.addChild({
            parentId: this.parentId,
            child: {
              ...result,
              role: Role.CHILD,
              totalPoints: 0,
            },
          })
        );
      }
    });
  }

  editChild(child: Child, editDialog: TemplateRef<any>): void {
    this.selectedChild = child;

    // Reset form with current child data
    this.childForm.patchValue({
      name: child.name || '',
      email: child.email || '',
      dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth) : '',
      picture: child.picture || '',
      password: '',
    });

    this.imagePreview = this.getImageUrl(child.picture);
    this.childForm.markAsPristine();

    const dialogData: DialogData = {
      title: 'Edit Child Profile',
      submitText: 'Update Child',
      child: child,
    };

    this.dialog.open(editDialog, {
      width: '600px',
      panelClass: 'custom-dialog',
      data: dialogData,
    });
  }

  managePoints(child: Child, pointsDialog: TemplateRef<any>): void {
    this.pointsForm.reset({ points: 0, reason: '' });

    const dialogData: DialogData = {
      title: `Manage Points for ${child.name}`,
      submitText: 'Add Points',
      child: child,
    };

    const dialogRef = this.dialog.open(pointsDialog, {
      width: '500px',
      panelClass: 'custom-dialog',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.parentId) {
        const points = Number(result.points);
        if (!isNaN(points)) {
          this.store.dispatch(
            ParentActions.addPoints({
              parentId: this.parentId,
              childId: child.id!,
              points: points,
              reason: result.reason || '',
            })
          );

          // Reload children after points update
          this.store.dispatch(
            ParentActions.loadChildren({
              parentId: this.parentId,
            })
          );

          // Reload point history if dialog is open
          this.store.dispatch(
            ParentActions.loadPointHistory({
              parentId: this.parentId,
              childId: child.id!,
            })
          );
        }
      }
    });
  }

  viewTasks(child: Child): void {
    this.router.navigate(['/parent/tasks'], {
      queryParams: { childId: child.id },
    });
  }

  viewPointHistory(child: Child, historyDialog: TemplateRef<any>): void {
    if (this.parentId) {
      this.store.dispatch(ParentActions.parentActionFailure({ error: null }));
      this.store.dispatch(
        ParentActions.loadPointHistory({
          parentId: this.parentId,
          childId: child.id!,
        })
      );

      const dialogData: DialogData = {
        title: `Point History for ${child.name}`,
        child: child,
      };

      const dialogRef = this.dialog.open(historyDialog, {
        width: '700px',
        panelClass: 'custom-dialog',
        data: dialogData,
        disableClose: false,
      });

      // Subscribe to point history errors
      const errorSub = this.error$.subscribe((error) => {
        if (error) {
          console.error('Error loading point history:', error);
          dialogRef.close();
        }
      });

      // Clean up subscription when dialog closes
      dialogRef.afterClosed().subscribe(() => {
        errorSub.unsubscribe();
      });
    }
  }

  deleteChild(child: Child, deleteDialog: TemplateRef<any>): void {
    const dialogData: DialogData = {
      title: 'Delete Child Profile',
      confirmText: 'Delete',
      child: child,
    };

    const dialogRef = this.dialog.open(deleteDialog, {
      width: '450px',
      panelClass: 'custom-dialog',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.parentId) {
        this.store.dispatch(
          ParentActions.deleteChild({
            parentId: this.parentId,
            childId: child.id!,
          })
        );
      }
    });
  }

  onSubmitChild(dialogRef?: MatDialogRef<any>): void {
    if (this.childForm.valid && this.parentId && this.selectedChild) {
      const formData = this.childForm.value;

      // Create update data with type assertion
      const updateData = {
        name: formData.name,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        password: formData.password || undefined, // Only include if it exists
      } as Partial<Child>;

      if (this.selectedFile) {
        this.uploadImage().subscribe(
          (imageUrl) => {
            updateData.picture = imageUrl;
            this.updateChild(updateData, dialogRef);
          },
          (error) => {
            console.error('Image upload failed:', error);
            this.updateChild(updateData, dialogRef);
          }
        );
      } else {
        this.updateChild(updateData, dialogRef);
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.childForm);
    }
  }

  private updateChild(updateData: Partial<Child>, dialogRef: any): void {
    if (this.parentId && this.selectedChild) {
      this.store.dispatch(
        ParentActions.updateChild({
          parentId: this.parentId,
          childId: this.selectedChild.id!,
          child: updateData,
        })
      );
      dialogRef.close();
    }
  }

  onSubmitPoints(dialogRef: MatDialogRef<any>): void {
    if (this.pointsForm.valid) {
      const formValue = this.pointsForm.value;
      const points = Number(formValue.points);
      if (!isNaN(points)) {
        dialogRef.close({
          points: points,
          reason: formValue.reason,
        });
      }
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.pointsForm);
    }
  }

  // Add this new method to handle image errors
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src =
      'https://res.cloudinary.com/dlwyetxjd/image/upload/v1741440913/qlmeun5wapfrgn5btfur.png';
  }

  // Add file handling methods
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or GIF)');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should not exceed 5MB');
        return;
      }

      this.selectedFile = file;

      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Update form value
      this.childForm.patchValue({
        picture: file.name, // We'll replace this with actual URL after upload
      });
    }
  }

  // New method to upload image to server
  uploadImage(): Observable<string> {
    if (!this.selectedFile) {
      return of(''); // Return an empty string instead of null
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    return this.http
      .post<{ imageUrl: string }>(
        `${environment.apiUrl}/uploads/images`,
        formData
      )
      .pipe(map((response) => response.imageUrl));
  }

  loadChildren() {
    // Get parent ID from auth state
    this.store
      .select(AuthSelectors.selectUser)
      .pipe(
        take(1) // Take only the first emission
      )
      .subscribe({
        next: (user) => {
          if (user?.id) {
            const token = localStorage.getItem('token');

            const headers = new HttpHeaders()
              .set('Authorization', `Bearer ${token}`)
              .set('Content-Type', 'application/json');

            this.http
              .get<any>(`${environment.apiUrl}/parents/${user.id}/children`, {
                headers: headers,
                observe: 'response',
              })
              .subscribe({
                next: (response) => {
                  this.children$ = of(response.body); // Convert to Observable
                },
                error: (error) => {
                  console.error('Error loading children:', error);
                  if (error.error instanceof ErrorEvent) {
                    console.error('Client-side error:', error.error.message);
                  } else {
                    console.error(`Server error ${error.status}:`, error.error);
                  }
                },
              });
          } else {
            console.error('No authenticated user found');
          }
        },
        error: (error) => console.error('Error getting user:', error),
      });
  }

  calculateAge(dateOfBirth: string | undefined): number {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getChildStatus(child: Child): StatusBadgeType {
    const points = child.totalPoints || 0;
    if (points >= 1000) return 'Superstar';
    if (points >= 500) return 'Rising Star';
    if (points >= 100) return 'Good Start';
    return 'Beginner';
  }

  getImageUrl(picture: string | undefined | null): string {
    if (!picture) {
      return 'https://res.cloudinary.com/dlwyetxjd/image/upload/v1741440913/qlmeun5wapfrgn5btfur.png';
    }
    return picture.startsWith('http')
      ? picture
      : `https://res.cloudinary.com/dlwyetxjd/image/upload/${picture}`;
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  // Form validation helpers
  hasError(form: FormGroup, controlName: string, errorName: string): boolean {
    const control = form.get(controlName);
    return control !== null && control.touched && control.hasError(errorName);
  }

  getErrorMessage(form: FormGroup, controlName: string): string {
    const control = form.get(controlName);

    if (!control) return '';

    if (control.hasError('required')) {
      return 'This field is required';
    }

    if (control.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength'].requiredLength} characters`;
    }

    if (control.hasError('maxlength')) {
      return `Maximum length is ${control.errors?.['maxlength'].requiredLength} characters`;
    }

    if (control.hasError('min')) {
      return `Minimum value is ${control.errors?.['min'].min}`;
    }

    if (control.hasError('max')) {
      return `Maximum value is ${control.errors?.['max'].max}`;
    }

    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (control.hasError('ageRange')) {
      return `Age must be between ${control.errors?.['ageRange'].min} and ${control.errors?.['ageRange'].max} years`;
    }

    if (control.hasError('pattern')) {
      return 'Invalid format';
    }

    return '';
  }

  // Format date for display
  formatDate(date: string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  // Format points with sign
  formatPoints(points: number): string {
    return points > 0 ? `+${points}` : `${points}`;
  }

  // Get color class for points
  getPointsClass(points: number): string {
    return points >= 0 ? 'text-green-500' : 'text-red-500';
  }

  handleFileInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }
}
