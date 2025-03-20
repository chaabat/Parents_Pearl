import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
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
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
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
  take,
  map,
  takeUntil,
  finalize,
  catchError,
} from 'rxjs/operators';
import { ParentService } from '../../../core/services/parent.service';
import { ParentState } from '../../../store/parent/parent.state';
import { Subject, of } from 'rxjs';

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
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
  searchResults: Task[] = [];
  searchError: string | null = null;

  taskStatus = ['ALL', 'PENDING', 'COMPLETED', 'FAILED'] as const;
  currentFilter: (typeof this.taskStatus)[number] = 'ALL';
  private destroy$ = new Subject<void>();

  // View mode toggle
  viewMode: 'table' | 'card' = 'table';

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
      dueDate: [
        null,
        [
          Validators.required,
          this.futureDateValidator(),  
        ],
      ],
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

    // Replace the search subscription in ngOnInit
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((keyword) => {
        if (!keyword || keyword.length < 2) {
          // Reset to original tasks
          if (this.parentId) {
            this.store.dispatch(
              ParentActions.loadTasks({
                parentId: this.parentId,
                status:
                  this.currentFilter === 'ALL' ? undefined : this.currentFilter,
              })
            );
          }
        } else {
          // Filter tasks locally
          this.store
            .select(ParentSelectors.selectTasks)
            .pipe(take(1))
            .subscribe((tasks) => {
              const filteredTasks = tasks.filter((task) =>
                task.title.toLowerCase().includes(keyword.toLowerCase())
              );
              this.dataSource.data = filteredTasks;
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
    this.store
      .select(ParentSelectors.selectTasks)
      .pipe(takeUntil(this.destroy$))
      .subscribe((tasks) => {
        this.dataSource.data = tasks || [];

        // Set paginator
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }

        this.applyFilter(this.currentFilter); // Apply current filter when data changes
      });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'table' ? 'card' : 'table';
  }

  private formatTaskData(formValue: any): Partial<Task> {
    // Ensure childId is a number
    const childId = formValue.childId ? Number(formValue.childId) : null;

    return {
      ...formValue,
      childId,
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
      width: '600px',
      panelClass: 'custom-dialog',
    });

    this.dialogRef = dialogRef;

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.parentId) {
        const taskData = this.formatTaskData(result);

        // Ensure childId is a number
        const childId = Number(result.childId);

        this.store.dispatch(
          ParentActions.createTask({
            parentId: this.parentId,
            childId,
            task: taskData,
          })
        );

        this.snackBar.open('Task created successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
      }
    });
  }

  editTask(task: Task, editDialog: TemplateRef<any>): void {
    if (!task.id || !task.childId) {
      console.error('Task ID or Child ID is missing');
      return;
    }

    // Prevent opening the details dialog
    event?.stopPropagation();

    const dueDate = task.dueDate ? new Date(task.dueDate) : null;

    // Store the original childId
    const originalChildId = task.childId;

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
      width: '600px',
      panelClass: 'custom-dialog',
      data: { task },
    });

    this.dialogRef = dialogRef;

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.parentId) {
        const taskData = this.formatTaskData(result);

        // Use the original childId for the API call path parameter
        // but include the potentially new childId in the task data
        this.store.dispatch(
          ParentActions.updateTask({
            parentId: this.parentId,
            childId: originalChildId,
            taskId: task.id!,
            task: taskData,
          })
        );

        this.snackBar.open('Task updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
      }
    });
  }

  deleteTask(task: Task, deleteDialog: TemplateRef<any>): void {
    if (!task.id || !task.childId) {
      console.error('Task ID or Child ID is missing');
      return;
    }

    // Prevent opening the details dialog
    event?.stopPropagation();

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

        this.snackBar.open('Task deleted successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
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
    // Only proceed if this wasn't triggered by clicking on action buttons
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
    this.children$.pipe(take(1)).subscribe((children) => {
      const child = children.find((c) => c.id === childId);
      if (child) {
        childName = child.name;
      }
    });
    return childName;
  }

  markTaskComplete(task: Task, event?: Event): void {
    // Prevent event propagation if event is provided
    if (event) {
      event.stopPropagation();
    }

    if (this.parentId && task.id && task.childId) {
      const updatedTask = {
        ...task,
        status: TaskStatus.COMPLETED,
      };

      console.log('Marking task as complete:', updatedTask);

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

  markTaskFailed(task: Task, event?: Event): void {
    // Prevent event propagation if event is provided
    if (event) {
      event.stopPropagation();
    }

    if (this.parentId && task.id && task.childId) {
      const updatedTask = {
        ...task,
        status: TaskStatus.FAILED,
      };

      console.log('Marking task as failed:', updatedTask);

      this.store.dispatch(
        ParentActions.updateTask({
          parentId: this.parentId,
          childId: task.childId,
          taskId: task.id,
          task: updatedTask,
        })
      );

      this.snackBar.open('Task marked as failed!', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
    }
  }

  markTaskPending(task: Task, event?: Event): void {
    // Prevent event propagation if event is provided
    if (event) {
      event.stopPropagation();
    }

    if (this.parentId && task.id && task.childId) {
      const updatedTask = {
        ...task,
        status: TaskStatus.PENDING,
      };

      console.log('Marking task as pending:', updatedTask);

      this.store.dispatch(
        ParentActions.updateTask({
          parentId: this.parentId,
          childId: task.childId,
          taskId: task.id,
          task: updatedTask,
        })
      );

      this.snackBar.open('Task reset to pending!', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['info-snackbar'],
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

  filterTasks(status: (typeof this.taskStatus)[number]) {
    this.currentFilter = status;

    // Clear search when filtering
    this.searchControl.setValue('');
    this.searchResults = [];

    // Apply filter to store
    if (this.parentId) {
      this.store.dispatch(
        ParentActions.loadTasks({
          parentId: this.parentId,
          status: status === 'ALL' ? undefined : status,
        })
      );
    }

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

  clearSearch() {
    this.searchControl.setValue('');
  }

  // Custom validator for future dates
  private futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);  

      if (selectedDate < today) {
        return { pastDate: true };
      }

      return null;
    };
  }

  // Add this to your getErrorMessage method
  getErrorMessage(controlName: string): string {
    const control = this.taskForm.get(controlName);
    if (control?.hasError('required')) {
      return `${
        controlName.charAt(0).toUpperCase() + controlName.slice(1)
      } is required`;
    }
    if (control?.hasError('pastDate')) {
      return 'Due date must be in the future';
    }
    // ... other error messages
    return '';
  }
}
