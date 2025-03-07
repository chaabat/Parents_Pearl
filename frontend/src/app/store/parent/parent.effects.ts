import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ParentService } from '../../core/services/parent.service';
import * as ParentActions from './parent.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class ParentEffects {
  constructor(
    private actions$: Actions,
    private parentService: ParentService
  ) {}

  // Profile Effects
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.loadParentProfile),
      mergeMap(({ parentId }) =>
        this.parentService.getParentProfile(parentId).pipe(
          map((parent) => ParentActions.loadParentProfileSuccess({ parent })),
          catchError((error) =>
            of(ParentActions.loadParentProfileFailure({ error }))
          )
        )
      )
    )
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.updateParentProfile),
      mergeMap(({ parentId, profileData }) =>
        this.parentService.updateParentProfile(parentId, profileData).pipe(
          map((parent) => ParentActions.loadParentProfileSuccess({ parent })),
          catchError((error) =>
            of(ParentActions.parentActionFailure({ error }))
          )
        )
      )
    )
  );

  // Children Effects
  loadChildren$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.loadChildren),
      mergeMap(({ parentId }) =>
        this.parentService.getMyChildren(parentId).pipe(
          map((children) => ParentActions.loadChildrenSuccess({ children })),
          catchError((error) =>
            of(ParentActions.parentActionFailure({ error }))
          )
        )
      )
    )
  );

  // Points Effects
  loadPointHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.loadPointHistory),
      mergeMap(({ parentId, childId }) =>
        this.parentService.getChildPointHistory(parentId, childId).pipe(
          map((points) => ParentActions.loadPointHistorySuccess({ points })),
          catchError((error) =>
            of(ParentActions.parentActionFailure({ error }))
          )
        )
      )
    )
  );

  awardPoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.awardPoints),
      mergeMap(({ parentId, childId, points, reason }) =>
        this.parentService.awardPoints(parentId, childId, points, reason).pipe(
          map(() => ParentActions.loadPointHistory({ parentId, childId })),
          catchError((error) =>
            of(ParentActions.parentActionFailure({ error }))
          )
        )
      )
    )
  );

  // Rewards Effects
  loadRewards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.loadRewards),
      mergeMap(({ parentId }) =>
        this.parentService.getAllRewards(parentId).pipe(
          map((rewards) => ParentActions.loadRewardsSuccess({ rewards })),
          catchError((error) =>
            of(ParentActions.parentActionFailure({ error }))
          )
        )
      )
    )
  );

  createReward$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.createReward),
      mergeMap(({ parentId, reward }) =>
        this.parentService.createReward(parentId, reward).pipe(
          map(() => ParentActions.loadRewards({ parentId })),
          catchError((error) =>
            of(ParentActions.parentActionFailure({ error }))
          )
        )
      )
    )
  );

  updateReward$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.updateReward),
      mergeMap(({ parentId, rewardId, reward }) =>
        this.parentService.updateReward(parentId, rewardId, reward).pipe(
          map(() => ParentActions.loadRewards({ parentId })),
          catchError((error) =>
            of(ParentActions.parentActionFailure({ error }))
          )
        )
      )
    )
  );

  deleteReward$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.deleteReward),
      mergeMap(({ parentId, rewardId }) =>
        this.parentService.deleteReward(parentId, rewardId).pipe(
          map(() => ParentActions.loadRewards({ parentId })),
          catchError((error) =>
            of(ParentActions.parentActionFailure({ error }))
          )
        )
      )
    )
  );
}
