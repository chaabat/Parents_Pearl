import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Task, TaskStatus, TaskType } from '../../../core/models/task.model';
import * as ParentActions from '../../../store/parent/parent.actions';
import * as ParentSelectors from '../../../store/parent/parent.selectors';
import * as AuthSelectors from '../../../store/auth/auth.selectors';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  take,
  map,
  takeUntil,
} from 'rxjs/operators';
import * as TaskActions from '../../../store/parent/parent.actions';
import * as TaskSelectors from '../../../store/parent/parent.selectors';
import { ParentService } from '../../../core/services/parent.service';
import { ParentState } from '../../../store/parent/parent.state';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit, OnDestroy {
  @ViewChild('taskDetailsDialog') taskDetailsDialog!: TemplateRef<any>;

  tasks$ = this.store.select(ParentSelectors.selectTasks);
  filteredTasks$ = this.store.select(ParentSelectors.selectFilteredTasks).pipe(
    map((tasks) => {
      // Convert to MatTableDataSource to fix the type error
      return tasks ? new MatTableDataSource(tasks) : new MatTableDataSource([]);
    })
  );
  loading$ = this.store.select(ParentSelectors.selectParentLoading);
  error$ = this.store.select(ParentSelectors.selectParentError);
  dataSource = new MatTableDataSource<Task>();
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
  selectedTask: Task | null = null;
  searchControl = new FormControl('');
  selectedChildId: number | undefined;
  protected ParentSelectors = ParentSelectors;
  searching = false;
  searchResults$ = this.store.select(ParentSelectors.selectSearchResults);

  taskStatus = ['ALL', 'PENDING', 'COMPLETED', 'FAILED'] as const;
  currentFilter: (typeof this.taskStatus)[number] = 'ALL';
  private destroy$ = new Subject<void>();
  constructor(
    public store: Store<{ parent: ParentState }>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private parentService: ParentService
  ) {
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

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((keyword) => {
        if (!keyword || keyword.length < 2) {
          this.store.select(ParentSelectors.selectTasks).subscribe();
        } else {
          this.store
            .select(ParentSelectors.selectParentId)
            .pipe(take(1))
            .subscribe((parentId) => {
              if (parentId) {
                this.parentService
                  .searchTasks(parentId, keyword)
                  .subscribe((tasks) => {
                    this.store.dispatch({
                      type: '[Parent] Set Filtered Tasks',
                      tasks,
                    });
                  });
              }
            });
        }
      });
  

    // Load initial tasks
    if (this.parentId) {
      this.store.dispatch(
        ParentActions.loadTasks({
          parentId: this.parentId,
          status: this.currentFilter === 'ALL' ? undefined : this.currentFilter,
        })
      );
    }

    // Subscribe to tasks and update data source
    this.store.select(ParentSelectors.selectTasks)
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        this.dataSource.data = tasks || [];
        this.applyFilter(this.currentFilter); // Apply current filter when data changes
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private formatTaskData(formValue: any): Partial<Task> {
    return {
      ...formValue,
      dueDate:
        formValue.dueDate instanceof Date
          ? formValue.dueDate.toISOString().split('T')[0]
          : formValue.dueDate, // Keep original value if not a Date object
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

    const dueDate = task.dueDate ? new Date(task.dueDate) : null;

    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      pointValue: task.pointValue,
      taskType: task.taskType,
      dueDate: dueDate,
      choices: task.choices?.join(','),
      correctAnswer: task.correctAnswer,
      childId: task.childId,
    });

    const dialogRef = this.dialog.open(editDialog, {
      width: '500px',
      data: { task },
    });

    this.dialogRef = dialogRef;

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.parentId) {
        const taskData = this.formatTaskData(result);
        this.store.dispatch(
          ParentActions.updateTask({
            parentId: this.parentId,
            childId: task.childId!,
            taskId: task.id!,
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

  getStatusColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600';
      case 'PENDING':
        return 'text-yellow-600';
      case 'FAILED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  getTaskTypeClass(type: TaskType): string {
    switch (type) {
      case TaskType.QUIZ:
        return 'bg-purple-100 text-purple-800';
      case TaskType.TRUE_FALSE:
        return 'bg-blue-100 text-blue-800';
      case TaskType.MAZE:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusClass(status: TaskStatus | undefined): string {
    if (!status) return '';

    switch (status) {
      case TaskStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case TaskStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case TaskStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusColorBar(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'bg-green-500';
      case TaskStatus.FAILED:
        return 'bg-red-500';
      case TaskStatus.PENDING:
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  }

  isOverdue(date: string | Date): boolean {
    return new Date(date) < new Date();
  }

  viewTaskDetails(task: Task): void {
    this.selectedTask = task;
    if (this.taskDetailsDialog) {
      this.dialog.open(this.taskDetailsDialog, {
        width: '600px',
        data: { task },
      });
    }
  }

  getTaskTypeIcon(type: TaskType): string {
    switch (type) {
      case TaskType.QUIZ:
        return 'quiz';
      case TaskType.TRUE_FALSE:
        return 'check_box';
      case TaskType.MAZE:
        return 'games';
      default:
        return 'assignment';
    }
  }

  getFormChoicesArray(): string[] {
    const choices = this.taskForm.get('choices')?.value;
    return choices ? choices.split(',').map((c: string) => c.trim()) : [];
  }

  getChoicesArray(choices: string | string[]): string[] {
    if (Array.isArray(choices)) return choices;
    return choices ? choices.split(',').map((c) => c.trim()) : [];
  }

  getChildName(childId: number | undefined): string {
    if (!childId) return '';
    let childName = '';
    this.children$.subscribe((children) => {
      const child = children.find((c) => c.id === childId);
      if (child) {
        childName = child.name;
      }
    });
    return childName;
  }

  markTaskComplete(task: Task): void {
    if (this.parentId && task.id && task.childId) {
      const updatedTask = {
        ...task,
        status: TaskStatus.COMPLETED,
      };

      this.store.dispatch(
        ParentActions.updateTask({
          parentId: this.parentId,
          childId: task.childId,
          taskId: task.id,
          task: updatedTask,
        })
      );

      this.snackBar.open('Task marked as complete!', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['success-snackbar'],
      });
    }
  }

  // Add method to change selected child
  onChildChange(childId: number) {
    this.selectedChildId = childId;
    this.store
      .select(ParentSelectors.selectChildById(childId))
      .subscribe((child) => {
        if (child) {
          this.store.dispatch(ParentActions.setSelectedChild({ child }));
        }
      });
  }

  completeTask(taskId: number, childId: number) {
    if (this.parentId) {
      this.store.dispatch(
        ParentActions.completeTask({
          parentId: this.parentId,
          childId: childId,
          taskId: taskId,
        })
      );
    }
  }

  filterTasks(status: typeof this.taskStatus[number]) {
    this.currentFilter = status;
    this.applyFilter(status);
  }

  private applyFilter(status: string) {
    this.dataSource.filterPredicate = (task: Task, filter: string) => {
      if (filter === 'ALL') return true;
      return task.status === filter;
    };
    this.dataSource.filter = status;
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'check_circle';
      case 'PENDING':
        return 'pending';
      case 'FAILED':
        return 'error';
      default:
        return 'help';
    }
  }
}
