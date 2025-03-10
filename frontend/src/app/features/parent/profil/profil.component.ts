import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

import { Parent } from '../../../core/models';
import * as ParentActions from '../../../store/parent/parent.actions';
import * as ParentSelectors from '../../../store/parent/parent.selectors';
import * as AuthSelectors from '../../../store/auth/auth.selectors';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
})
export class ProfilComponent implements OnInit {
  @ViewChild('fileInputEdit') fileInput!: ElementRef;
  
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
    private http: HttpClient
  ) {
    this.parent$ = this.store.select(ParentSelectors.selectParentProfile);
    this.loading$ = this.store.select(ParentSelectors.selectParentLoading);
    this.error$ = this.store.select(ParentSelectors.selectParentError);

    this.parentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      picture: [''],
    });
  }

  ngOnInit(): void {
    this.store.select(AuthSelectors.selectUser).subscribe((user) => {
      if (user?.id) {
        this.parentId = user.id;
        this.store.dispatch(
          ParentActions.loadParentProfile({ parentId: user.id })
        );
      }
    });

    this.parent$.subscribe((parent) => {
      if (parent) {
        this.parentForm.patchValue({
          name: parent.name,
          email: parent.email,
          password: parent.password || '',
          picture: parent.picture || '',
        });
        if (parent.picture) {
          this.imagePreview = parent.picture;
        }
      }
    });
  }

  onSubmit(): void {
    if (this.parentForm.valid && this.parentId) {
      if (this.selectedFile) {
        // If there's a new image, upload it first
        this.uploadImage().subscribe(
          (imageUrl) => {
            const formData = {
              ...this.parentForm.value,
              picture: imageUrl
            };
            this.updateProfile(formData);
          },
          (error) => {
            console.error('Image upload failed:', error);
            // Still update other fields even if image upload fails
            this.updateProfile(this.parentForm.value);
          }
        );
      } else {
        // No new image, just update the profile
        this.updateProfile(this.parentForm.value);
      }
    }
  }

  private updateProfile(profileData: any): void {
    this.store.dispatch(
      ParentActions.updateParentProfile({
        parentId: this.parentId!,
        profileData
      })
    );
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
}
