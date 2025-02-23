import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.types';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  userRole$ = this.store.select(state => state.auth.user?.role);
  children$ = this.store.select(state => state.auth.children);
  
  get isReadOnly(): boolean {
    return this.route.snapshot.params['id'] && 
           this.store.select(state => state.auth.user?.role !== 'PARENT');
  }

  constructor(
    private fb: FormBuilder,
    private store: Store<{ auth: AuthState }>,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // If viewing a child profile
    if (this.route.snapshot.params['id']) {
      this.store.select(state => 
        state.auth.children?.find(child => 
          child.id === this.route.snapshot.params['id']
        )
      ).subscribe(child => {
        if (child) {
          this.profileForm.patchValue({
            firstName: child.firstName,
            lastName: child.lastName,
            email: child.email
          });
        }
      });
    } else {
      // Loading own profile
      this.store.select(state => state.auth.user).subscribe(user => {
        if (user) {
          this.profileForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          });
        }
      });
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const childId = this.route.snapshot.params['id'];
      if (childId) {
        // Update child profile
        console.log('Updating child profile:', { id: childId, ...this.profileForm.value });
      } else {
        // Update own profile
        console.log('Updating own profile:', this.profileForm.value);
      }
    }
  }

  editChild(childId: string) {
    // Navigate to child profile edit
    console.log('Edit child:', childId);
  }

  deleteChild(childId: string) {
    // Show confirmation dialog and delete child profile
    console.log('Delete child:', childId);
  }
} 