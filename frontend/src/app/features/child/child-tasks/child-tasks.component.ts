import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { Store } from '@ngrx/store';
import { Task } from '../../../core/models/task.model';
import * as ChildActions from '../../../store/child/child.actions';
import * as ChildSelectors from '../../../store/child/child.selectors';
import * as AuthSelectors from '../../../store/auth/auth.selectors';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-child-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    MatChipsModule
  ],
  templateUrl: './child-tasks.component.html',
  styleUrls: ['./child-tasks.component.css'],
})
export class ChildTasksComponent implements OnInit {
  tasks$ = this.store.select(ChildSelectors.selectChildTasks);
  loading$ = this.store.select(ChildSelectors.selectChildLoading);
  selectedTask: Task | null = null;
  answer: string = '';

  constructor(
    private store: Store,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Get childId from auth state and load tasks
    this.store.select(AuthSelectors.selectUser)
      .pipe(take(1))
      .subscribe(user => {
        if (user && user.id) {
          this.loadTasks(user.id);
        } else {
          this.snackBar.open('User not found', 'Close', { duration: 3000 });
        }
      });
  }

  loadTasks(childId: number) {
    this.store.dispatch(ChildActions.loadMyTasks({ childId }));
  }

  viewTask(task: Task) {
    this.selectedTask = task;
  }

  submitAnswer() {
    if (this.selectedTask && this.answer.trim()) {
      this.store.select(AuthSelectors.selectUser)
        .pipe(take(1))
        .subscribe(user => {
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
  }
}
