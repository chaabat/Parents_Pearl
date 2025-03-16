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
import { take, tap } from 'rxjs/operators';
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
          // Load child profile and rewards data
          this.store.dispatch(ChildActions.loadChildProfile({ childId: user.id }));
          this.store.dispatch(ChildActions.loadRewards({ childId: user.id }));
          this.store.dispatch(ChildActions.loadRedemptions({ childId: user.id }));
        }
      });

    // Debug logging
    this.redemptions$.subscribe(redemptions => {
      console.log('Raw redemptions:', redemptions);
      if (redemptions && redemptions.length > 0) {
        redemptions.forEach(redemption => {
          console.log('Redemption:', {
            id: redemption.id,
            rewardId: redemption.rewardId,
            date: redemption.redemptionDate,
            formattedDate: this.formatDate(redemption.redemptionDate)
          });
        });
      }
    });

    // Debug rewards
    this.rewards$.subscribe(rewards => {
      console.log('Available rewards:', rewards);
    });
  }

  getRewardName(rewardId: number): Observable<string> {
    return this.store.select(ChildSelectors.selectChildRewards).pipe(
      map((rewards) => {
        const reward = rewards.find((r) => r.id === rewardId);
        return reward?.name || 'Unknown Reward';
      })
    );
  }
  redeemReward(reward: Reward): void {
    if (this.isRewardRedeemed(reward.id)) {
      this.snackBar.open('Reward already redeemed', 'Close', {
        duration: 3000,
      });
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to redeem ${reward.name} for ${reward.pointCost} points?`
    );

    if (confirmed) {
      this.store.dispatch(ChildActions.redeemReward({ rewardId: reward.id }));
    }
  }

  formatDate(dateString: string | Date | undefined): string {
    if (!dateString) {
      console.log('Missing date for redemption');
      return 'Recently redeemed';
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.log('Invalid date format:', dateString);
        return 'Recently redeemed';
      }

      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error, 'for date:', dateString);
      return 'Recently redeemed';
    }
  }

  isRewardRedeemed(rewardId: number): boolean {
    return this.redeemedRewards.has(rewardId);
  }

  getRewardDetails(redemption: RewardRedemption): Observable<RewardDetails> {
    return this.store.select(ChildSelectors.selectChildRewards).pipe(
      map(rewards => {
        const reward = rewards.find(r => r.id === redemption.rewardId);
        return {
          name: reward?.name || 'Unknown Reward',
          points: redemption.pointCost
        };
      })
    );
  }
}