import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Task, TaskStatus, TaskType } from '../../../core/models/task.model';
import * as ParentActions from '../../../store/parent/parent.actions';
import * as ParentSelectors from '../../../store/parent/parent.selectors';
import * as AuthSelectors from '../../../store/auth/auth.selectors';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  tasks$: Observable<Task[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  taskForm: FormGroup;
  parentId: number | undefined;
  displayedColumns: string[] = [
    'title',
    'description',
    'pointValue',
    'taskType',
    'status',
    'dueDate',
    'actions',
  ];
  taskStatuses = Object.values(TaskStatus);
  taskTypes = Object.values(TaskType);
  children$ = this.store.select(ParentSelectors.selectChildren);
  dialogRef: any;

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.tasks$ = this.store.select(ParentSelectors.selectTasks);
    this.loading$ = this.store.select(ParentSelectors.selectParentLoading);
    this.error$ = this.store.select(ParentSelectors.selectParentError);

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      pointValue: [0, [Validators.required, Validators.min(0)]],
      taskType: [TaskType.MAZE, Validators.required],
      dueDate: [null, Validators.required],
      choices: [''],
      correctAnswer: ['', Validators.required],
      childId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.store.select(AuthSelectors.selectUser).subscribe((user) => {
      if (user?.id) {
        this.parentId = user.id;
        this.store.dispatch(ParentActions.loadTasks({ parentId: user.id }));
        this.store.dispatch(ParentActions.loadChildren({ parentId: user.id }));
      }
    });
  }

  private formatTaskData(formValue: any): Partial<Task> {
    return {
      ...formValue,
      dueDate: formValue.dueDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      choices:
        typeof formValue.choices === 'string'
          ? formValue.choices.split(',').map((c: string) => c.trim())
          : formValue.choices,
    };
  }

  openAddTaskDialog(addDialog: TemplateRef<any>): void {
    this.taskForm.reset({
      title: '',
      description: '',
      pointValue: 0,
      taskType: TaskType.MAZE,
      dueDate: null,
      choices: '',
      correctAnswer: '',
      childId: null,
    });

    const dialogRef = this.dialog.open(addDialog, {
      width: '500px',
    });

    this.dialogRef = dialogRef;

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.parentId) {
        const taskData = this.formatTaskData(result);
        this.store.dispatch(
          ParentActions.createTask({
            parentId: this.parentId,
            childId: result.childId,
            task: taskData,
          })
        );
      }
    });
  }

  editTask(task: Task, editDialog: TemplateRef<any>): void {
    if (!task.id || !task.childId) {
      console.error('Task ID or Child ID is missing');
      return;
    }

    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      pointValue: task.pointValue,
      taskType: task.taskType,
      dueDate: task.dueDate,
      choices: task.choices?.join(','),
      correctAnswer: task.correctAnswer,
      childId: task.childId,
    });

    const dialogRef = this.dialog.open(editDialog, {
      width: '500px',
      data: { task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.parentId) {
        const taskData = this.formatTaskData(result);
        this.store.dispatch(
          ParentActions.updateTask({
            parentId: this.parentId,
            childId: task.childId!, // Add non-null assertion since we checked above
            taskId: task.id!, // Add non-null assertion since we checked above
            task: taskData,
          })
        );
      }
    });
  }

  deleteTask(task: Task, deleteDialog: TemplateRef<any>): void {
    if (!task.id || !task.childId) {
      console.error('Task ID or Child ID is missing');
      return;
    }

    const dialogRef = this.dialog.open(deleteDialog, {
      width: '400px',
      data: { task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.parentId) {
        this.store.dispatch(
          ParentActions.deleteTask({
            parentId: this.parentId,
            childId: task.childId!,
            taskId: task.id!,
          })
        );
      }
    });
  }

  getStatusColor(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'text-green-600';
      case TaskStatus.FAILED:
        return 'text-red-600';
      case TaskStatus.PENDING:
        return 'text-blue-600';
      default:
        return 'text-yellow-600';
    }
  }
}

