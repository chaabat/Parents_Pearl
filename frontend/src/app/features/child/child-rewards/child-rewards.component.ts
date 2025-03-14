import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import * as ChildActions from '../../../store/child/child.actions';
import * as ChildSelectors from '../../../store/child/child.selectors';
import * as AuthSelectors from '../../../store/auth/auth.selectors';
import { Reward, RewardRedemption } from '../../../core/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-child-rewards',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './child-rewards.component.html',
  styleUrls: ['./child-rewards.component.css'],
})
export class ChildRewardsComponent implements OnInit {
  rewards$: Observable<Reward[]>;
  redemptions$: Observable<RewardRedemption[]>;
  totalPoints$: Observable<number>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.rewards$ = this.store.select(ChildSelectors.selectChildRewards);
    this.redemptions$ = this.store.select(
      ChildSelectors.selectChildRedemptions
    );
    this.totalPoints$ = this.store.select(ChildSelectors.selectTotalPoints);
    this.loading$ = this.store.select(ChildSelectors.selectChildLoading);
  }

  ngOnInit(): void {
    this.store.select(AuthSelectors.selectUser).pipe(
      take(1)
    ).subscribe(user => {
      if (user && user.id) {
        console.log('Loading rewards for child:', user.id);
        this.store.dispatch(ChildActions.loadRewards({ childId: user.id }));
        this.store.dispatch(ChildActions.loadRedemptions({ childId: user.id }));
      }
    });

    this.rewards$ = this.store.select(ChildSelectors.selectChildRewards).pipe(
      tap(rewards => console.log('Rewards loaded:', rewards))
    );
    this.redemptions$ = this.store.select(ChildSelectors.selectChildRedemptions);
    this.loading$ = this.store.select(ChildSelectors.selectChildLoading);
  }

  redeemReward(reward: Reward): void {
    const confirmed = confirm(
      `Are you sure you want to redeem ${reward.name} for ${reward.pointCost} points?`
    );
    if (confirmed) {
      this.store.dispatch(ChildActions.redeemReward({ rewardId: reward.id }));
      this.snackBar.open('Reward redeemed successfully!', 'Close', {
        duration: 3000,
      });
    }
  }

  formatDate(dateString: string | Date): string {
    return new Date(dateString).toLocaleDateString();
  }
}
