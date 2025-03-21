import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../shared/material.module';
import { ChildService } from '../../../core/services/child.service';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '../../../store/auth/auth.selectors';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-child-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSelectModule,
  ],
  templateUrl: './child-tasks.component.html',
  styleUrls: ['./child-tasks.component.css'],
})
export class ChildTaskComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('taskDetailDialog') taskDetailDialog!: TemplateRef<any>;
  @ViewChild('successNotification') successNotification!: TemplateRef<any>;
  @ViewChild('failedTaskNotification')
  failedTaskNotification!: TemplateRef<any>;

  private destroy$ = new Subject<void>();

  childId: number | null = null;
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedTask: Task | null = null;
  taskAnswer = '';
  isLoading = false;
  selectedStatus = 'ALL';
  totalPoints = 0;
  completedTaskPoints = 0;
  failedTaskTitle = '';

  // Pagination
  pageSize = 5;
  pageIndex = 0;
  totalTasks = 0;

  // Task check interval (in milliseconds)
  private readonly TASK_CHECK_INTERVAL = 60000; // Check every minute
  private readonly EXPIRING_SOON_THRESHOLD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  constructor(
    private childService: ChildService,
    private store: Store,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.store
      .select(AuthSelectors.selectUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user && user.id) {
          this.childId = user.id;
          this.loadTasks();
          this.loadTotalPoints();

          // Start periodic task status check
          this.startTaskStatusCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Start periodic check for task status updates
   */
  startTaskStatusCheck(): void {
    interval(this.TASK_CHECK_INTERVAL)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.ngZone.run(() => {
          this.checkTaskStatuses();
        });
      });

    // Also check immediately on load
    this.checkTaskStatuses();
  }

  /**
   * Check all pending tasks to see if any have expired
   */
  checkTaskStatuses(): void {
    const now = new Date();
    let tasksUpdated = false;

    this.tasks.forEach((task) => {
      if (task.status === 'PENDING' && task.dueDate) {
        const dueDate = new Date(task.dueDate);

        // If due date has passed, mark as failed
        if (dueDate < now) {
          task.status = TaskStatus.FAILED;
          tasksUpdated = true;

          // Show notification for failed task
          this.failedTaskTitle = task.title;
          this.snackBar.openFromTemplate(this.failedTaskNotification, {
            duration: 1000,
            panelClass: ['warning-snackbar'],
          });

          // Update task status on server
          this.updateTaskStatusOnServer(task.id, 'FAILED');
        }
      }
    });

    // If any tasks were updated, refresh the filtered list
    if (tasksUpdated) {
      this.filteredTasks = [...this.tasks];
      this.applyFilters();
    }
  }

  /**
   * Update task status on the server
   */
  updateTaskStatusOnServer(taskId: number, status: string): void {
    if (!this.childId) return;

    console.log(`Updating task ${taskId} to status ${status}`);
  }

  /**
   * Check if a task is expiring soon (within 24 hours)
   */
  isTaskExpiringSoon(task: Task | null): boolean {
    if (!task || task.status !== 'PENDING' || !task.dueDate) return false;

    const now = new Date().getTime();
    const dueDate = new Date(task.dueDate).getTime();
    const timeRemaining = dueDate - now;

    return timeRemaining > 0 && timeRemaining < this.EXPIRING_SOON_THRESHOLD;
  }

  loadTasks(): void {
    if (!this.childId) return;

    this.isLoading = true;
    this.childService
      .getMyTasks(this.childId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.filteredTasks = [...tasks];
          this.totalTasks = tasks.length;
          this.applyFilters();
          this.isLoading = false;

          // Check for expired tasks immediately
          this.checkTaskStatuses();
        },
        error: (error) => {
          console.error('Error loading tasks:', error);
          this.isLoading = false;
          this.snackBar.open(
            'Failed to load tasks. Please try again.',
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
        },
      });
  }

  loadTotalPoints(): void {
    if (!this.childId) return;

    this.childService
      .getTotalPoints(this.childId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (points) => {
          this.totalPoints = points;
        },
        error: (error) => {
          console.error('Error loading points:', error);
        },
      });
  }

  refreshTasks(): void {
    this.loadTasks();
  }

  filterTasks(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredTasks = [...this.tasks];
    this.applyStatusFilter();
  }

  applyStatusFilter(): void {
    if (this.selectedStatus !== 'ALL') {
      this.filteredTasks = this.filteredTasks.filter(
        (task) => task.status === this.selectedStatus
      );
    }
    this.totalTasks = this.filteredTasks.length;
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  openTaskDialog(task: Task): void {
    this.selectedTask = task;
    this.taskAnswer = '';
    this.dialog.open(this.taskDetailDialog, {
      width: '500px',
      maxWidth: '95vw',
    });
  }

  submitTaskAnswer(): void {
    if (!this.childId || !this.selectedTask || !this.taskAnswer.trim()) return;

    this.isLoading = true;

    // First check if the answer is correct
    const isCorrect =
      this.selectedTask.correctAnswer?.toLowerCase() ===
      this.taskAnswer.trim().toLowerCase();

    this.childService
      .submitTaskAnswer(this.childId, this.selectedTask.id, this.taskAnswer)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Update task status based on whether answer was correct
          if (isCorrect) {
            this.completeTaskWithAnswer(this.selectedTask!, this.taskAnswer);
          } else {
            this.failTask(this.selectedTask!);
          }
        },
        error: (error) => {
          console.error('Error submitting answer:', error);
          this.isLoading = false;
          this.snackBar.open(
            'Failed to submit answer. Please try again.',
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
        },
      });
  }

  private failTask(task: Task): void {
    if (!this.childId) return;

    // Update task status to FAILED
    const index = this.tasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = {
        ...task,
        status: TaskStatus.FAILED,
        answer: this.taskAnswer,
      };

      // Update filtered tasks
      this.filteredTasks = [...this.tasks];
      this.applyFilters();
    }

    this.isLoading = false;
    this.dialog.closeAll();

    // Show failure notification
    this.snackBar.open('Incorrect answer. Task marked as failed.', 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  // Update the completeTaskWithAnswer method to only be called for correct answers
  private completeTaskWithAnswer(task: Task, answer: string): void {
    if (!this.childId) return;

    this.childService
      .completeTask(this.childId, task.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedTask) => {
          this.isLoading = false;
          this.dialog.closeAll();

          // Update task in the list with the answer and completed status
          const index = this.tasks.findIndex((t) => t.id === task.id);
          if (index !== -1) {
            updatedTask.answer = answer;
            this.tasks[index] = updatedTask;

            // Update filtered tasks
            this.filteredTasks = [...this.tasks];
            this.applyFilters();
          }

          // Show success notification
          this.completedTaskPoints = task.pointValue;
          this.snackBar.openFromTemplate(this.successNotification, {
            duration: 5000,
            panelClass: ['success-snackbar'],
          });

          // Update points immediately
          this.totalPoints += task.pointValue;
        },
        error: (error) => {
          console.error('Error completing task:', error);
          this.isLoading = false;
          this.snackBar.open(
            'Failed to complete task. Please try again.',
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  calculateTimeProgress(task: Task): number {
    if (!task.dueDate || task.status !== 'PENDING') return 0;

    const now = new Date().getTime();
    const createdDate = new Date(task.createdAt || now).getTime();
    const dueDate = new Date(task.dueDate).getTime();

    const totalDuration = dueDate - createdDate;
    const elapsed = now - createdDate;

    // Calculate percentage of time elapsed (inverted to show time remaining)
    const timeElapsedPercent = Math.min(
      100,
      Math.max(0, (elapsed / totalDuration) * 100)
    );
    return 100 - timeElapsedPercent; // Invert to show time remaining
  }

  navigateToRewards(): void {
    this.router.navigate(['/child/rewards']);
  }
}
