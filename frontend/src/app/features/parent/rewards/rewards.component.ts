import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Reward } from '../../../core/models/reward.model';
import * as ParentActions from '../../../store/parent/parent.actions';
import * as ParentSelectors from '../../../store/parent/parent.selectors';
import * as AuthSelectors from '../../../store/auth/auth.selectors';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
  ],
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css'],
})
export class RewardsComponent implements OnInit {
  rewards$: Observable<Reward[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  rewardForm: FormGroup;
  parentId: number | undefined;
  dialogRef: any;
  displayedColumns: string[] = ['name', 'description', 'pointCost', 'actions'];

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.rewards$ = this.store.select(ParentSelectors.selectRewards);
    this.loading$ = this.store.select(ParentSelectors.selectParentLoading);
    this.error$ = this.store.select(ParentSelectors.selectParentError);

    this.rewardForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      pointCost: [0, [Validators.required, Validators.min(1), Validators.max(1000)]],
    });

    // Subscribe to errors
    this.error$.subscribe(error => {
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

  openAddRewardDialog(addDialog: TemplateRef<any>): void {
    this.rewardForm.reset({
      name: '',
      description: '',
      pointCost: 0,
    });

    this.dialogRef = this.dialog.open(addDialog, {
      width: '500px',
      disableClose: true
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
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('min')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors?.['min'].min}`;
    }
    if (control?.hasError('max')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be less than ${control.errors?.['max'].max}`;
    }
    return '';
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
} 