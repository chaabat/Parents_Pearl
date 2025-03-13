import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { Store } from '@ngrx/store';
import { Task, TaskStatus } from '../../../core/models/task.model';
import * as ChildActions from '../../../store/child/child.actions';
import * as ChildSelectors from '../../../store/child/child.selectors';
import * as AuthSelectors from '../../../store/auth/auth.selectors';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-child-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    MatChipsModule,
    MatCardModule,
  ],
  templateUrl: './child-tasks.component.html',
  styleUrls: ['./child-tasks.component.css'],
})
export class ChildTasksComponent implements OnInit {
  tasks$ = this.store.select(ChildSelectors.selectChildTasks);
  loading$ = this.store.select(ChildSelectors.selectChildLoading);
  selectedTask: Task | null = null;
  answer: string = '';
  TaskStatus = TaskStatus;

  constructor(private store: Store, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.store
      .select(AuthSelectors.selectUser)
      .pipe(take(1))
      .subscribe((user) => {
        if (user && user.id) {
          this.loadTasks(user.id);
        }
      });
  }

  loadTasks(childId: number) {
    this.store.dispatch(ChildActions.loadMyTasks({ childId }));
  }

  viewTask(task: Task) {
    if (task.status === TaskStatus.COMPLETED) {
      this.snackBar.open('This task has already been completed', 'Close', {
        duration: 3000,
      });
      return;
    }
    this.selectedTask = task;
  }

  submitAnswer() {
    if (!this.selectedTask || !this.answer.trim()) {
      return;
    }

    if (this.selectedTask.status === TaskStatus.COMPLETED) {
      this.snackBar.open('This task has already been completed', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.store
      .select(AuthSelectors.selectUser)
      .pipe(take(1))
      .subscribe((user) => {
        if (user && user.id) {
          this.store.dispatch(
            ChildActions.submitTaskAnswer({
              childId: user.id,
              taskId: this.selectedTask!.id,
              answer: this.answer,
            })
          );
          this.answer = '';
          this.selectedTask = null;
        }
      });
  }

  getTaskStatusClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case TaskStatus.FAILED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
