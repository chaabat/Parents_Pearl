import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { Store } from '@ngrx/store';
import { Task } from '../../../core/models/task.model';
import * as ChildActions from '../../../store/child/child.actions';
import * as ChildSelectors from '../../../store/child/child.selectors';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';

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
  childId = 1; // TODO: Get from auth state
  selectedTask: Task | null = null;
  answer: string = '';

  constructor(private store: Store) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.store.dispatch(ChildActions.loadMyTasks({ childId: this.childId }));
  }

  viewTask(task: Task) {
    this.selectedTask = task;
  }

  submitAnswer() {
    if (this.selectedTask && this.answer.trim()) {
      this.store.dispatch(
        ChildActions.submitTaskAnswer({
          childId: this.childId,
          taskId: this.selectedTask.id,
          answer: this.answer,
        })
      );
      this.answer = '';
      this.selectedTask = null;
    }
  }
}
