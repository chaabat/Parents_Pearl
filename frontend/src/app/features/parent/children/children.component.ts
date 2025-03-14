import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
import { map, take } from 'rxjs/operators';
import { MatChipsModule } from '@angular/material/chips';

import { Child, Role } from '../../../core/models';
import * as ParentActions from '../../../store/parent/parent.actions';
import * as ParentSelectors from '../../../store/parent/parent.selectors';
import * as AuthSelectors from '../../../store/auth/auth.selectors';
import { ParentService } from '../../../core/services/parent.service';

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
  ],
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.css'],
})
export class ChildrenComponent implements OnInit {
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
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      dateOfBirth: ['', [Validators.required, ageValidator(6, 18)]],
      picture: [''],
      role: [Role.CHILD],
      totalPoints: [0],
      tasks: [[]],
      points: [[]],
      rewardRedemptions: [[]],
    });

    this.pointsForm = this.fb.group({
      points: [0, [Validators.required]],
      reason: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Get parent ID and load children
    this.store.select(AuthSelectors.selectUser).subscribe({
      next: (user) => {
        if (user?.id) {
          this.parentId = user.id;
          console.log('Loading children for parent:', this.parentId);
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
    this.children$.subscribe({
      next: (children) => {
        console.log('Children updated:', children);
      },
      error: (error) => {
        console.error('Error loading children:', error);
      },
    });
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

    const dialogRef = this.dialog.open(addDialog, {
      width: '500px',
      data: {
        form: this.childForm,
      },
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
      dateOfBirth: child.dateOfBirth || '',
      picture: child.picture || '',
      // Don't set password as it should be empty for updates
      password: '',
    });

    // Reset form dirty state after setting initial values
    this.childForm.markAsPristine();

    this.dialog.open(editDialog, {
      width: '500px',
      data: { child: child },
    });
  }

  managePoints(child: Child, pointsDialog: TemplateRef<any>): void {
    this.pointsForm.reset({ points: 0, reason: '' });

    const dialogRef = this.dialog.open(pointsDialog, {
      width: '400px',
      data: { child: child },
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
    // Load point history before opening dialog
    if (this.parentId) {
      // Clear any previous errors
      this.store.dispatch(ParentActions.parentActionFailure({ error: null }));

      // Load point history
      this.store.dispatch(
        ParentActions.loadPointHistory({
          parentId: this.parentId,
          childId: child.id!,
        })
      );

      const dialogRef = this.dialog.open(historyDialog, {
        width: '600px',
        data: { child: child },
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
    const dialogRef = this.dialog.open(deleteDialog, {
      width: '400px',
      data: { child: child },
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
    }
  }

  private updateChild(updateData: Partial<Child>, dialogRef: any): void {
    if (this.parentId && this.selectedChild) {
      console.log('Updating child with data:', updateData); // Debug log
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
        `${environment.apiUrl}/upload/images`,
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
            console.log('Loading children for parent:', user.id);

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
                  console.log('Children loaded successfully:', response.body);
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

  getChildStatus(child: Child): string {
    const points = child.totalPoints ?? 0; // Use 0 if totalPoints is undefined
    if (points >= 100) return 'Superstar';
    if (points >= 50) return 'Rising Star';
    if (points >= 25) return 'Good Start';
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
}
