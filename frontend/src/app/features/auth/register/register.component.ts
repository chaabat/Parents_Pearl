import { Component } from '@angular/core';
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
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  imagePreview: string | null = null;
  defaultImage = 'assets/images/default-avatar.png';
  maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        picture: [null, [Validators.required, this.fileValidator.bind(this)]],
        role: ['PARENT'],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
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
    if (!control.value) {
      return null;
    }

    const file = control.value as File;

    if (!this.allowedFileTypes.includes(file.type)) {
      return { invalidType: true };
    }

    if (file.size > this.maxFileSize) {
      return { invalidSize: true };
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

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = new FormData();

      // Add all form fields to FormData
      Object.keys(this.registerForm.value).forEach((key) => {
        const value = this.registerForm.get(key)?.value;
        if (value !== null && value !== undefined) {
          // Handle Date objects
          if (value instanceof Date) {
            formData.append(key, value.toISOString());
          }
          // Handle File objects
          else if (key === 'picture' && value instanceof File) {
            formData.append(key, value, value.name);
          }
          // Handle other values
          else {
            formData.append(key, value);
          }
        }
      });

      this.authService.register(formData).subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
        },
      });
    }
  }
}
