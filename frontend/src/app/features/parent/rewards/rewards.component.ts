import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { Reward } from '../../../core/models/reward.model';
import * as ParentActions from '../../../store/parent/parent.actions';
import * as ParentSelectors from '../../../store/parent/parent.selectors';
import * as AuthSelectors from '../../../store/auth/auth.selectors';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTooltipModule,
  ],
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css'],
})
export class RewardsComponent implements OnInit, AfterViewInit {
  allRewards$ = this.store.select(ParentSelectors.selectRewards);
  loading$ = this.store.select(ParentSelectors.selectParentLoading);
  error$ = this.store.select(ParentSelectors.selectParentError);

  // Pagination and filtering
  pageSize = 6;
  pageSizeOptions = [3, 6, 12, 24];
  currentPage = 0;
  totalRewards = 0;

  // Search and filter
  searchTerm = new BehaviorSubject<string>('');
  sortOption = new BehaviorSubject<
    'newest' | 'oldest' | 'points-high' | 'points-low'
  >('newest');

  // Filtered and paginated rewards
  filteredRewards$: Observable<Reward[]>;
  displayedRewards$: Observable<Reward[]>;

  // View mode
  viewMode: 'grid' | 'list' = 'grid';

  // Initialize rewardForm
  rewardForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    pointCost: [0, [Validators.required, Validators.min(1), Validators.max(1000)]]
  });

  parentId: number | undefined;
  dialogRef: MatDialogRef<any> | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private gradients = [
    'from-purple-600 to-blue-500',
    'from-blue-600 to-teal-500',
    'from-green-600 to-teal-500',
    'from-yellow-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-indigo-600 to-purple-500',
  ];

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    // Create filtered rewards stream
    this.filteredRewards$ = combineLatest([
      this.allRewards$,
      this.searchTerm.asObservable().pipe(startWith('')),
      this.sortOption.asObservable(),
    ]).pipe(
      map(([rewards, search, sort]) => {
        if (!rewards) return [];

        // Apply search filter
        let filtered = rewards;
        if (search.trim()) {
          const term = search.toLowerCase();
          filtered = filtered.filter(
            (reward) =>
              reward.name.toLowerCase().includes(term) ||
              reward.description.toLowerCase().includes(term)
          );
        }

        // Apply sorting
        switch (sort) {
          case 'newest':
            filtered = [...filtered].sort((a, b) => (b.id || 0) - (a.id || 0));
            break;
          case 'oldest':
            filtered = [...filtered].sort((a, b) => (a.id || 0) - (b.id || 0));
            break;
          case 'points-high':
            filtered = [...filtered].sort(
              (a, b) => (b.pointCost || 0) - (a.pointCost || 0)
            );
            break;
          case 'points-low':
            filtered = [...filtered].sort(
              (a, b) => (a.pointCost || 0) - (b.pointCost || 0)
            );
            break;
        }

        return filtered;
      }),
      tap((rewards) => {
        this.totalRewards = rewards.length;
        if (this.paginator) {
          this.paginator.length = this.totalRewards;
          if (
            this.currentPage > 0 &&
            this.totalRewards <= this.pageSize * this.currentPage
          ) {
            this.currentPage = 0;
            this.paginator.pageIndex = 0;
          }
        }
      })
    );

    // Create paginated rewards stream
    this.displayedRewards$ = combineLatest([
      this.filteredRewards$,
      this.searchTerm.asObservable(),
    ]).pipe(
      map(([rewards]) => {
        const start = this.currentPage * this.pageSize;
        const end = start + this.pageSize;
        return rewards.slice(start, end);
      })
    );

    // Subscribe to errors
    this.error$.subscribe((error) => {
      if (error) {
        this.showErrorMessage(error.message || 'An error occurred');
      }
    });
  }

  ngOnInit(): void {
    this.store.select(AuthSelectors.selectUser).subscribe((user) => {
      if (user?.id) {
        this.parentId = user.id;
        this.store.dispatch(ParentActions.loadRewards({ parentId: user.id }));
      }
    });
  }

  ngAfterViewInit(): void {
    // Reset paginator when filters change
    this.searchTerm.subscribe(() => {
      if (this.paginator) {
        this.paginator.pageIndex = 0;
        this.currentPage = 0;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  updateSearchTerm(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.next(value);
  }

  clearSearch(): void {
    this.searchTerm.next('');
  }

  setSortOption(
    option: 'newest' | 'oldest' | 'points-high' | 'points-low'
  ): void {
    this.sortOption.next(option);
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  openAddRewardDialog(addDialog: TemplateRef<any>): void {
    this.rewardForm.reset({
      name: '',
      description: '',
      pointCost: 0,
      
    });

    this.dialogRef = this.dialog.open(addDialog, {
      width: '500px',
      panelClass: 'reward-dialog',
      disableClose: true,
    });

    this.dialogRef.afterClosed().subscribe((result: Reward) => {
      if (result && this.parentId) {
        if (this.rewardForm.valid) {
          const reward = {
            ...result,
            parentId: this.parentId,
          };
          this.store.dispatch(
            ParentActions.createReward({
              parentId: this.parentId,
              reward,
            })
          );
          this.showSuccessMessage('Reward created successfully');
        } else {
          this.showErrorMessage('Please fill all required fields correctly');
        }
      }
    });
  }

  editReward(reward: Reward, editDialog: TemplateRef<any>): void {
    this.rewardForm.patchValue({
      name: reward.name,
      description: reward.description,
      pointCost: reward.pointCost,
    });

    this.dialogRef = this.dialog.open(editDialog, {
      width: '500px',
      panelClass: 'reward-dialog',
      disableClose: true,
      data: { reward },
    });

    this.dialogRef.afterClosed().subscribe((result: Reward) => {
      if (result && this.parentId && reward.id) {
        if (this.rewardForm.valid) {
          const updatedReward = {
            ...result,
            id: reward.id,
            parentId: this.parentId,
          };
          this.store.dispatch(
            ParentActions.updateReward({
              parentId: this.parentId,
              rewardId: reward.id,
              reward: updatedReward,
            })
          );
          this.showSuccessMessage('Reward updated successfully');
        } else {
          this.showErrorMessage('Please fill all required fields correctly');
        }
      }
    });
  }

  deleteReward(reward: Reward, deleteDialog: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(deleteDialog, {
      width: '400px',
      panelClass: 'delete-dialog',
      data: { reward },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.parentId && reward.id) {
        this.store.dispatch(
          ParentActions.deleteReward({
            parentId: this.parentId,
            rewardId: reward.id,
          })
        );
        this.showSuccessMessage('Reward deleted successfully');
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.rewardForm.get(controlName);
    if (control?.hasError('required')) {
      return `${
        controlName.charAt(0).toUpperCase() + controlName.slice(1)
      } is required`;
    }
    if (control?.hasError('minlength')) {
      return `${
        controlName.charAt(0).toUpperCase() + controlName.slice(1)
      } must be at least ${
        control.errors?.['minlength'].requiredLength
      } characters`;
    }
    if (control?.hasError('min')) {
      return `${
        controlName.charAt(0).toUpperCase() + controlName.slice(1)
      } must be at least ${control.errors?.['min'].min}`;
    }
    if (control?.hasError('max')) {
      return `${
        controlName.charAt(0).toUpperCase() + controlName.slice(1)
      } must be less than ${control.errors?.['max'].max}`;
    }
    return '';
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }

  getGradient(reward: Reward): string {
    if (!reward.gradient) {
      // Use reward.id to get a consistent gradient for the same reward
      const index = (reward.id || 0) % this.gradients.length;
      return this.gradients[index];
    }
    return reward.gradient;
  }
}
