import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../store/auth/auth.actions';
import {
  selectAuthError,
  selectAuthLoading,
} from '../../../store/auth/auth.selectors';

interface FileEvent {
  target: HTMLInputElement;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterLink,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  hidePassword = true;
  imagePreview: string | null = null;
  defaultImage = 'assets/images/default-avatar.png';
  maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
  errorMessage: string = '';
  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      dateOfBirth: ['', [Validators.required]],
      picture: [null, [this.fileValidator.bind(this)]],
      role: ['PARENT'],
    });
  }

  ngOnInit(): void {
    // Clear any existing errors when component initializes
    this.store.dispatch(AuthActions.clearError());
  }

  ngOnDestroy() {
    // Clear errors when component is destroyed
    this.store.dispatch(AuthActions.clearError());
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    }
    return null;
  }

  private fileValidator(control: AbstractControl): ValidationErrors | null {
    const file = control.value;
    if (file) {
      if (!this.allowedFileTypes.includes(file.type)) {
        return {
          invalidFile: 'Please upload a valid image file (JPEG, PNG, or GIF)',
        };
      }
      if (file.size > this.maxFileSize) {
        return { invalidFile: 'File size must be less than 5MB' };
      }
    }
    return null;
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
      return;
    }

    // Reset file input if validation fails
    const resetFileInput = () => {
      target.value = '';
      this.imagePreview = null;
      this.registerForm.patchValue({ picture: null });
    };

    // Validate file type
    if (!this.allowedFileTypes.includes(file.type)) {
      console.error(
        'Invalid file type. Please upload a JPEG, PNG or GIF image.'
      );
      resetFileInput();
      return;
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      console.error('File is too large. Maximum size is 5MB');
      resetFileInput();
      return;
    }

    // Create image preview
    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.onerror = () => {
      console.error('Error reading file');
      resetFileInput();
    };

    try {
      reader.readAsDataURL(file);
      this.registerForm.patchValue({ picture: file });
      this.registerForm.get('picture')?.markAsTouched();
    } catch (error) {
      console.error('Error processing file:', error);
      resetFileInput();
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      // Clear any previous errors before attempting registration
      this.store.dispatch(AuthActions.clearError());
      const userData = this.prepareFormData();
      console.log('Submitting registration data:', userData);
      this.store.dispatch(AuthActions.register({ userData }));
    }
  }

  private prepareFormData(): any {
    const formValue = this.registerForm.value;
    return {
      ...formValue,
      dateOfBirth: formValue.dateOfBirth?.toISOString(),
      picture: this.registerForm.get('picture')?.value,
      role: 'PARENT',
    };
  }
}
