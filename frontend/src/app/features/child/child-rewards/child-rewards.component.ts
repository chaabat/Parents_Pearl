import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import * as ChildActions from '../../../store/child/child.actions';
import * as ChildSelectors from '../../../store/child/child.selectors';
import * as AuthSelectors from '../../../store/auth/auth.selectors';
import { Reward, RewardRedemption } from '../../../core/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { CustomDatePipe } from '../../../pipe/date.pipe';

interface RewardDetails {
  name: string;
  points: number;
}

@Component({
  selector: 'app-child-rewards',
  standalone: true,
  imports: [CommonModule, MaterialModule, CustomDatePipe],
  templateUrl: './child-rewards.component.html',
  styleUrls: ['./child-rewards.component.css'],
})
export class ChildRewardsComponent implements OnInit {
  rewards$: Observable<Reward[]>;
  redemptions$: Observable<RewardRedemption[]>;
  totalPoints$: Observable<number>;
  loading$: Observable<boolean>;
  redeemedRewards: Set<number> = new Set();

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.rewards$ = this.store.select(ChildSelectors.selectChildRewards);
    this.redemptions$ = this.store.select(
      ChildSelectors.selectChildRedemptions
    );
    this.totalPoints$ = this.store
      .select(ChildSelectors.selectTotalPoints)
      .pipe(map((points) => points ?? 0)); // Ensure we always have a number
    this.loading$ = this.store.select(ChildSelectors.selectChildLoading);

    // Track redeemed rewards
    this.redemptions$.subscribe((redemptions) => {
      this.redeemedRewards = new Set(redemptions.map((r) => r.rewardId));
    });
  }

  ngOnInit(): void {
    this.store
      .select(AuthSelectors.selectUser)
      .pipe(take(1))
      .subscribe((user) => {
        if (user?.id) {
          console.log('Loading data for child:', user.id);
          this.store.dispatch(
            ChildActions.loadChildProfile({ childId: user.id })
          );
          this.store.dispatch(ChildActions.loadRewards({ childId: user.id }));
          this.store.dispatch(
            ChildActions.loadRedemptions({ childId: user.id })
          );
        }
      });

    // Debug subscriptions
    this.redemptions$.subscribe((redemptions) => {
      console.log('Current redemptions:', redemptions);
    });
  }

  getRewardName(redemption: RewardRedemption): string {
    return redemption.reward?.name || 'Unknown Reward';
  }

  redeemReward(reward: Reward): void {
    if (this.isRewardRedeemed(reward.id)) {
      this.snackBar.open('Reward already redeemed', 'Close', {
        duration: 3000,
        panelClass: ['bg-purple-700', 'text-white'],
      });
      return;
    }

    // Check if user has enough points
    this.totalPoints$.pipe(take(1)).subscribe((points) => {
      if (points < reward.pointCost) {
        this.snackBar.open(
          `Not enough points. You need ${
            reward.pointCost - points
          } more points.`,
          'Close',
          {
            duration: 4000,
            panelClass: ['bg-red-600', 'text-white'],
          }
        );
        return;
      }

      // Confirm redemption
      const confirmed = confirm(
        `Are you sure you want to redeem "${reward.name}" for ${reward.pointCost} points?`
      );

      if (confirmed) {
        this.store.dispatch(ChildActions.redeemReward({ rewardId: reward.id }));

        // Show success message
        this.snackBar.open(
          `Successfully redeemed "${reward.name}"!`,
          'Awesome!',
          {
            duration: 5000,
            panelClass: ['bg-green-600', 'text-white'],
          }
        );
      }
    });
  }

  formatDate(date: string | null): string {
    if (!date) {
      console.log('No date provided');
      return 'Recently redeemed';
    }

    try {
      console.log('Formatting date:', date);
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        console.log('Invalid date:', date);
        return 'Recently redeemed';
      }

      const now = new Date();
      const diff = now.getTime() - dateObj.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (minutes < 60) {
        return minutes <= 1 ? 'Just now' : `${minutes} minutes ago`;
      }

      if (hours < 24) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      }

      if (days < 7) {
        return dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric',
        });
      }

      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Recently redeemed';
    }
  }

  isRewardRedeemed(rewardId: number): boolean {
    return this.redeemedRewards.has(rewardId);
  }

  getRewardDetails(redemption: RewardRedemption): Observable<RewardDetails> {
    return this.store.select(ChildSelectors.selectChildRewards).pipe(
      map((rewards) => {
        const reward = rewards.find((r) => r.id === redemption.rewardId);
        return {
          name: reward?.name || 'Unknown Reward',
          points: redemption.points_spent,
        };
      })
    );
  }

  getPointCost(redemption: RewardRedemption): number {
    return redemption.points_spent;
  }
}