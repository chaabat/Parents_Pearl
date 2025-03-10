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
  parent$: Observable<Parent | null>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  parentId: number | undefined;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private http: HttpClient,
    private parentService: ParentService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.parent$ = this.store.select(ParentSelectors.selectParentProfile);
    this.loading$ = this.store.select(ParentSelectors.selectParentLoading);
    this.error$ = this.store.select(ParentSelectors.selectParentError);

    this.parentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      dateOfBirth: [''],
      picture: [''],
    });
  }

  ngOnInit(): void {
    // Get the current user's ID and load their profile
    this.store.select(AuthSelectors.selectUser).subscribe((user) => {
      if (user?.id) {
        this.parentId = user.id;
        // Load the parent profile
        this.parentService.getParentProfile(user.id).subscribe(
          (parent) => {
            if (parent) {
              // Update form with existing data
              this.parentForm.patchValue({
                name: parent.name,
                email: parent.email,
                dateOfBirth: parent.dateOfBirth,
                picture: parent.picture || '',
              });
              if (parent.picture) {
                this.imagePreview = parent.picture;
              }
            }
          },
          (error) => {
            console.error('Error loading parent profile:', error);
          }
        );
      }
    });
  }

  onSubmit(): void {
    if (this.parentForm.valid && this.parentId) {
      // Create a copy of the form value
      const updateData = { ...this.parentForm.value };

      // Remove empty fields to avoid overwriting existing data
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === '' || updateData[key] === null) {
          delete updateData[key];
        }
      });

      if (this.selectedFile) {
        // If there's a new image, upload it first
        this.uploadImage().subscribe(
          (imageUrl) => {
            updateData.picture = imageUrl;
            this.updateProfile(updateData);
          },
          (error) => {
            console.error('Image upload failed:', error);
            // Still update other fields even if image upload fails
            this.updateProfile(updateData);
          }
        );
      } else {
        // No new image, just update the profile
        this.updateProfile(updateData);
      }
    }
  }

  private updateProfile(profileData: any): void {
    if (this.parentId) {
      this.parentService
        .updateParentProfile(this.parentId, profileData)
        .subscribe(
          (updatedParent) => {
            // Dispatch success action to update store
            this.store.dispatch(
              ParentActions.loadParentProfileSuccess({ parent: updatedParent })
            );
          },
          (error) => {
            console.error('Error updating profile:', error);
          }
        );
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
}
