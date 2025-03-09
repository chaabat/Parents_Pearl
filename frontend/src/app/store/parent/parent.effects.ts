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

  addChild$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.addChild),
      mergeMap(({ parentId, child }) => {
        console.log('Effect: Adding child:', child, 'for parent:', parentId);
        return this.parentService.addChild(parentId, child).pipe(
          mergeMap((response) => {
            console.log('Child added successfully:', response);
            // Return array of actions to dispatch
            return [
              ParentActions.addChildSuccess({ child: response }),
              ParentActions.loadChildren({ parentId }), // Automatically reload children
            ];
          }),
          catchError((error) => {
            console.error('Error adding child:', error);
            return of(ParentActions.addChildFailure({ error }));
          })
        );
      })
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

  // Task Effects
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.loadTasks),
      mergeMap(({ parentId }) =>
        this.parentService.getTasks(parentId).pipe(
          map((tasks) => ParentActions.loadTasksSuccess({ tasks })),
          catchError((error) =>
            of(ParentActions.parentActionFailure({ error }))
          )
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.createTask),
      mergeMap(({ parentId, childId, task }) =>
        this.parentService.createTask(parentId, childId, task).pipe(
          mergeMap((newTask) => [
            ParentActions.createTaskSuccess({ task: newTask }),
            ParentActions.loadTasks({ parentId }), // Reload tasks after creation
          ]),
          catchError((error) =>
            of(ParentActions.parentActionFailure({ error }))
          )
        )
      )
    )
  );
}
