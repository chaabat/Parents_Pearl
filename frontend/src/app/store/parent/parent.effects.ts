import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ParentService } from '../../core/services/parent.service';
import * as ParentActions from './parent.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable()
export class ParentEffects {
  constructor(
    private actions$: Actions,
    private parentService: ParentService,
    private store: Store
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
          map((points) => {
            console.log('Point history loaded:', points);
            return ParentActions.loadPointHistorySuccess({ points });
          }),
          catchError((error) => {
            console.error('Error in loadPointHistory effect:', error);
            return of(
              ParentActions.parentActionFailure({
                error: 'Failed to load point history. Please try again.',
              })
            );
          })
        )
      )
    )
  );

  addPoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.addPoints),
      mergeMap(({ parentId, childId, points, reason }) =>
        this.parentService.addPoints(parentId, childId, points, reason).pipe(
          map((response) => {
            // After successful points update, trigger children reload
            this.store.dispatch(ParentActions.loadChildren({ parentId }));
            return ParentActions.addPointsSuccess({ points: response });
          }),
          catchError((error) => of(ParentActions.addPointsFailure({ error })))
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

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.updateTask),
      mergeMap(({ parentId, childId, taskId, task }) =>
        this.parentService.updateTask(parentId, childId, taskId, task).pipe(
          mergeMap((updatedTask) => [
            ParentActions.updateTaskSuccess({ task: updatedTask }),
            ParentActions.loadTasks({ parentId }),
          ]),
          catchError((error) =>
            of(ParentActions.parentActionFailure({ error }))
          )
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.deleteTask),
      mergeMap(({ parentId, childId, taskId }) =>
        this.parentService.deleteTask(parentId, childId, taskId).pipe(
          mergeMap(() => [
            ParentActions.deleteTaskSuccess({ taskId }),
            ParentActions.loadTasks({ parentId }),
          ]),
          catchError((error) =>
            of(ParentActions.parentActionFailure({ error }))
          )
        )
      )
    )
  );
}
