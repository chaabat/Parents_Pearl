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
import { map } from 'rxjs/operators';

import { Child, Role } from '../../../core/models';
import * as ParentActions from '../../../store/parent/parent.actions';
import * as ParentSelectors from '../../../store/parent/parent.selectors';
import * as AuthSelectors from '../../../store/auth/auth.selectors';

function ageValidator(minAge: number, maxAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < minAge || age > maxAge) {
      return { 
        ageRange: { 
          min: minAge, 
          max: maxAge, 
          actual: age 
        } 
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

  constructor(
    private store: Store,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpClient
    
  ) {
    this.children$ = this.store.select(ParentSelectors.selectChildren);
    this.loading$ = this.store.select(ParentSelectors.selectParentLoading);
    this.error$ = this.store.select(ParentSelectors.selectParentError);

    // Initialize forms
    this.childForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        dateOfBirth: ['', [Validators.required, ageValidator(6, 18)]],
        picture: [''],
        role: [Role.CHILD],
        totalPoints: [0],
        tasks: [[]],
        points: [[]],
        rewardRedemptions: [[]],
      },
     
    );

    this.pointsForm = this.fb.group({
      points: [0, [Validators.required, Validators.min(0)]],
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
          this.store.dispatch(ParentActions.loadChildren({ parentId: user.id }));
        }
      },
      error: (error) => {
        console.error('Error getting user:', error);
      }
    });
  
    // Subscribe to children updates
    this.children$.subscribe({
      next: (children) => {
        console.log('Children updated:', children);
      },
      error: (error) => {
        console.error('Error loading children:', error);
      }
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
    this.childForm.patchValue({
      name: child.name,
      email: child.email,
      dateOfBirth: child.dateOfBirth,
      picture: child.picture,
      role: Role.CHILD,
      totalPoints: child.totalPoints || 0,
      tasks: child.tasks || [],
      points: child.points || [],
      rewardRedemptions: child.rewardRedemptions || [],
    });

    const dialogRef = this.dialog.open(editDialog, {
      width: '500px',
      data: {
        form: this.childForm,
        child,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.parentId) {
        this.store.dispatch(
          ParentActions.updateChild({
            parentId: this.parentId,
            childId: child.id,
            child: result,
          })
        );
      }
    });
  }

  managePoints(child: Child, pointsDialog: TemplateRef<any>): void {
    this.pointsForm.reset({ points: 0, reason: '' });

    const dialogRef = this.dialog.open(pointsDialog, {
      width: '400px',
      data: {
        form: this.pointsForm,
        child,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.parentId) {
        this.store.dispatch(
          ParentActions.awardPoints({
            parentId: this.parentId,
            childId: child.id,
            points: result.points,
            reason: result.reason,
          })
        );
      }
    });
  }

  viewTasks(child: Child): void {
    // Navigate to tasks page
    this.router.navigate(['/dashboard/tasks', child.id]);
  }

  viewPointHistory(child: Child, historyDialog: TemplateRef<any>): void {
    this.dialog.open(historyDialog, {
      width: '600px',
      data: { child },
    });
  }

  deleteChild(child: Child, deleteDialog: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(deleteDialog, {
      width: '400px',
      data: { child },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.parentId) {
        this.store.dispatch(
          ParentActions.deleteChild({
            parentId: this.parentId,
            childId: child.id,
          })
        );
      }
    });
  }

  onSubmitChild(dialogRef: any): void {
    if (this.childForm.valid) {
      if (this.selectedFile) {
        this.uploadImage().subscribe(
          (imageUrl: string) => {
            // Update the form with the actual image URL
            const formData = this.childForm.value;
            // Only set picture if we got a valid URL
            if (imageUrl) {
              formData.picture = imageUrl;
            }
            dialogRef.close(formData);
            
            // Reset file selection
            this.selectedFile = null;
            this.imagePreview = null;
          },
          (error: any) => {
            console.error('Image upload failed', error);
            // Still close the dialog even if image upload fails
            dialogRef.close(this.childForm.value);
          }
        );
      } else {
        dialogRef.close(this.childForm.value);
      }
    }
  }

  onSubmitPoints(dialogRef: any): void {
    if (this.pointsForm.valid) {
      dialogRef.close(this.pointsForm.value);
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
    const parentId = 3; // Or whatever ID you're using
    
    // Get token directly
    const token = localStorage.getItem('token');
    console.log('Direct test - Token:', token);
    
    // Create explicit headers
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    
    console.log('Direct test - Headers:', headers);
    
    // Make direct HTTP request with explicit headers
    this.http.get<any>(`${environment.apiUrl}/parents/${parentId}/children`, { 
      headers: headers,
      observe: 'response' // This will let us see the full response including headers
    }).subscribe({
      next: (response) => {
        console.log('Direct test - Success!', response);
        console.log('Direct test - Response headers:', response.headers);
        this.children$ = response.body;
      },
      error: (error) => {
        console.error('Direct test - Error:', error);
        console.log('Direct test - Request that failed:', error.request);
        
        // Try to extract more information about the failed request
        if (error.error instanceof ErrorEvent) {
          console.error('Direct test - Client-side error:', error.error.message);
        } else {
          console.error(`Direct test - Server returned code ${error.status}, body:`, error.error);
        }
      }
    });
  }

 
}
