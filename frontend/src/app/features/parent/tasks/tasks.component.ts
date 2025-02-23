import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Task } from '../../../store/parent/parent.types';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
})
export class TasksComponent {
  tasks$ = this.store.select(state => state.parent.tasks);
  showAddForm = false;

  taskForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    points: [0, [Validators.required, Validators.min(0)]],
    dueDate: ['', Validators.required],
    childId: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private store: Store<{ parent: { tasks: Task[] } }>
  ) {}

  onSubmit() {
    if (this.taskForm.valid) {
      // Dispatch action to add task
      console.log(this.taskForm.value);
      this.showAddForm = false;
      this.taskForm.reset();
    }
  }

  editTask(task: Task) {
    // Implement edit functionality
    console.log('Edit task:', task);
  }

  deleteTask(taskId: string) {
    // Implement delete functionality
    console.log('Delete task:', taskId);
  }

  getProgressWidth(task: Task): string {
    // Implement progress calculation
    return '50%';
  }
} 