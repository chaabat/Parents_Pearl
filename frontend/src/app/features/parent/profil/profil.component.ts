import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Parent } from '../../../core/models';
import * as ParentActions from '../../../store/parent/parent.actions';
import * as ParentSelectors from '../../../store/parent/parent.selectors';
import * as AuthSelectors from '../../../store/auth/auth.selectors';
import { environment } from '../../../../environments/environment';
import { ParentService } from '../../../core/services/parent.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
})
export class ProfilComponent implements OnInit {
  @ViewChild('fileInputEdit') fileInput!: ElementRef;
  @ViewChild('deleteConfirmDialog') deleteConfirmDialog!: TemplateRef<any>;

  parentForm: FormGroup;
  parentId: number | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  parent$ = this.store.select(ParentSelectors.selectParentProfile);
  loading$ = this.store.select(ParentSelectors.selectParentLoading);
  error$ = this.store.select(ParentSelectors.selectParentError);
  originalProfile: Parent | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private http: HttpClient,
    private parentService: ParentService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.parentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: [''],
      picture: [''],
      password: [''],
    });
  }

  ngOnInit(): void {
    // Load current user's profile
    this.store.select(AuthSelectors.selectUser).subscribe((user) => {
      if (user?.id) {
        this.parentId = user.id;
        this.store.dispatch(
          ParentActions.loadParentProfile({ parentId: user.id })
        );
      }
    });

    // Subscribe to profile data changes
    this.parent$.subscribe((parent) => {
      if (parent) {
        // Store original profile for comparison
        this.originalProfile = { ...parent };

        // Update form with current values
        this.parentForm.patchValue(
          {
            name: parent.name,
            email: parent.email,
            dateOfBirth: parent.dateOfBirth ? parent.dateOfBirth : null,
            picture: parent.picture,
          },
          { emitEvent: false }
        );

        if (parent.picture) {
          this.imagePreview = parent.picture;
        }
      }
    });
  }

  onSubmit(): void {
    if (this.parentForm.valid && this.parentId) {
      const formValue = this.parentForm.value;
      const updateData: Partial<Parent> = {
        // Always include required fields with their current values
        name: formValue.name || this.originalProfile?.name,
        email: formValue.email || this.originalProfile?.email,
      };

      // Only include optional fields if they've changed
      if (formValue.dateOfBirth !== this.originalProfile?.dateOfBirth) {
        updateData.dateOfBirth = formValue.dateOfBirth;
      }
      if (formValue.password) {
        updateData.password = formValue.password;
      }

      // Handle image upload if there's a new file
      if (this.selectedFile) {
        this.uploadImage().subscribe({
          next: (imageUrl) => {
            updateData.picture = imageUrl;
            this.updateProfile(updateData);
          },
          error: () => this.updateProfile(updateData),
        });
      } else {
        this.updateProfile(updateData);
      }
    }
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
      this.selectedFile = file;

      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Update form value
      this.parentForm.patchValue({
        picture: file.name, // Temporary value until upload
      });
    }
  }

  // Upload image to server
  uploadImage(): Observable<string> {
    if (!this.selectedFile) {
      return of('');
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

  // Trigger file input click
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  openDeleteConfirmDialog(): void {
    this.dialog.open(this.deleteConfirmDialog, {
      width: '400px',
    });
  }

  confirmDelete(): void {
    if (this.parentId) {
      this.parentService.deleteParentAccount(this.parentId).subscribe(
        () => {
          // Clear local storage and navigate to login
          localStorage.clear();
          this.router.navigate(['/auth/login']);
        },
        (error) => {
          console.error('Error deleting account:', error);
        }
      );
    }
  }

  private updateProfile(updateData: Partial<Parent>): void {
    if (this.parentId && Object.keys(updateData).length > 0) {
      this.store.dispatch(
        ParentActions.updateParentProfile({
          parentId: this.parentId,
          profileData: updateData,
        })
      );
    }
  }
}
