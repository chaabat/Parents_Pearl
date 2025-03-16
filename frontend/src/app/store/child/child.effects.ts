import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  map,
  mergeMap,
  catchError,
  tap,
  switchMap,
  take,
} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChildService } from '../../core/services/child.service';
import * as ChildActions from './child.actions';
import { ChildResponse } from '../../core/models';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '../auth/auth.selectors';

@Injectable()
export class ChildEffects {
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChildActions.loadChildProfile),
      mergeMap(({ childId }) =>
        this.childService.getChildProfile(childId).pipe(
          map((profile) => {
            console.log('Profile loaded successfully:', profile);
            return ChildActions.loadChildProfileSuccess({ profile });
          }),
          catchError((error) => {
            console.error('Error loading profile:', error);
            return of(ChildActions.loadChildProfileFailure({ error }));
          })
        )
      )
    )
  );

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChildActions.loadMyTasks),
      mergeMap(({ childId }) =>
        this.childService.getMyTasks(childId).pipe(
          map((tasks) => ChildActions.loadMyTasksSuccess({ tasks })),
          catchError((error) => of(ChildActions.loadMyTasksFailure({ error })))
        )
      )
    )
  );

  submitTaskAnswer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChildActions.submitTaskAnswer),
      mergeMap(({ childId, taskId, answer }) =>
        this.childService.submitTaskAnswer(childId, taskId, answer).pipe(
          map((response) => {
            this.snackBar.open('Answer submitted successfully', 'Close', {
              duration: 3000,
            });
            return ChildActions.submitTaskAnswerSuccess({
              taskAnswer: response,
            });
          }),
          catchError((error) => {
            this.snackBar.open('Failed to submit answer', 'Close', {
              duration: 3000,
            });
            return of(ChildActions.submitTaskAnswerFailure({ error }));
          })
        )
      )
    )
  );

  // Reload tasks after successful submission
  reloadTasksAfterSubmission$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChildActions.submitTaskAnswerSuccess),
      mergeMap(() =>
        this.store.select(AuthSelectors.selectUser).pipe(
          take(1),
          map((user) => {
            if (user && user.id) {
              return ChildActions.loadMyTasks({ childId: user.id });
            }
            return { type: '[Child] No User Found' };
          })
        )
      )
    )
  );

  loadPoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChildActions.loadPoints),
      mergeMap(({ childId }) =>
        this.childService.getMyPointHistory(childId).pipe(
          map((points) => ChildActions.loadPointsSuccess({ points })),
          catchError((error) => of(ChildActions.loadPointsFailure({ error })))
        )
      )
    )
  );

  // Reload points after successful task submission
  reloadPointsAfterSubmission$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChildActions.submitTaskAnswerSuccess),
      mergeMap(() =>
        this.store.select(AuthSelectors.selectUser).pipe(
          take(1),
          map((user) => {
            if (user && user.id) {
              return ChildActions.loadPoints({ childId: user.id });
            }
            return { type: '[Child] No User Found' };
          })
        )
      )
    )
  );

  // Add effects for rewards
  loadRewards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChildActions.loadRewards),
      switchMap(({ childId }) =>
        this.childService.getChildRewards(childId).pipe(
          map((rewards) => ChildActions.loadRewardsSuccess({ rewards })),
          catchError((error) => of(ChildActions.loadRewardsFailure({ error })))
        )
      )
    )
  );

  loadRedemptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChildActions.loadRedemptions),
      switchMap(({ childId }) =>
        this.childService.getChildRedemptions(childId).pipe(
          map(redemptions => ChildActions.loadRedemptionsSuccess({ redemptions })),
          catchError(error => of(ChildActions.loadRedemptionsFailure({ error })))
        )
      )
    )
  );

  redeemReward$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChildActions.redeemReward),
      switchMap(({ rewardId }) =>
        this.store.select(AuthSelectors.selectUser).pipe(
          take(1),
          switchMap(user => {
            if (user?.id) {
              return this.childService.redeemReward(user.id, rewardId).pipe(
                mergeMap(redemption => [
                  ChildActions.redeemRewardSuccess({ redemption }),
                  ChildActions.loadChildProfile({ childId: user.id }),
                  ChildActions.loadRedemptions({ childId: user.id })
                ]),
                catchError(error => {
                  this.snackBar.open('Failed to redeem reward', 'Close', {
                    duration: 3000
                  });
                  return of(ChildActions.redeemRewardFailure({ error }));
                })
              );
            }
            return of({ type: '[Child] No User Found' });
          })
        )
      )
    )
  );

  loadChildDataAfterProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChildActions.loadChildProfileSuccess),
      map(({ profile }) => profile),
      mergeMap((profile) => {
        if (profile?.id) {
          return [
            ChildActions.loadRewards({ childId: profile.id }),
            ChildActions.loadRedemptions({ childId: profile.id })
          ];
        }
        return [];
      })
    )
  );

  constructor(
    private actions$: Actions,
    private childService: ChildService,
    private snackBar: MatSnackBar,
    private store: Store
  ) {}
}