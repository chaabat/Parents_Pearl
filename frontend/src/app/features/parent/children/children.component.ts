import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Child } from '../../../store/auth/auth.types';

@Component({
  selector: 'app-children',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './children.component.html',
})
export class ChildrenComponent implements OnInit {
  children$ = this.store.select((state) => state.auth.children);
  showAddForm = false;

  childForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private store: Store<{ auth: { children: Child[] } }>
  ) {}

  ngOnInit() {
    // Load children if needed
  }

  onSubmit() {
    if (this.childForm.valid) {
      // Dispatch action to add child
      console.log(this.childForm.value);
      this.showAddForm = false;
      this.childForm.reset();
    }
  }

  editChild(child: Child) {
    // Navigate to edit page or show edit modal
    console.log('Edit child:', child);
  }

  deleteChild(childId: string) {
    // Show confirmation dialog and delete
    console.log('Delete child:', childId);
  }

  viewTasks(childId: string) {
    // Navigate to tasks page
    console.log('View tasks:', childId);
  }

  viewProgress(childId: string) {
    // Navigate to progress page
    console.log('View progress:', childId);
  }
}
