import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ParentService } from '../../core/services/parent.service';
import * as ParentActions from './parent.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as AuthActions from '../auth/auth.actions';
import { Router } from '@angular/router';
import { withLatestFrom, switchMap } from 'rxjs/operators';
import * as ParentSelectors from './parent.selectors';

@Injectable()
export class ParentEffects {
  constructor(
    private actions$: Actions,
    private parentService: ParentService,
    private store: Store,
    private router: Router
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
            of(ParentActions.loadChildrenFailure({ error }))
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
      switchMap(({ parentId, status }) =>
        this.parentService.getTasks(parentId, status).pipe(
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

  deleteChild$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.deleteChild),
      mergeMap(({ parentId, childId }) =>
        this.parentService.deleteChild(parentId, childId).pipe(
          map(() => {
            // After successful deletion, load children again
            return ParentActions.loadChildren({ parentId });
          }),
          catchError((error) =>
            of(ParentActions.parentActionFailure({ error }))
          )
        )
      )
    )
  );

  updateChild$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.updateChild),
      mergeMap(({ parentId, childId, child }) =>
        this.parentService.updateChild(parentId, childId, child).pipe(
          map((updatedChild) => {
            console.log('Child updated successfully:', updatedChild);
            return ParentActions.updateChildSuccess({ child: updatedChild });
          }),
          catchError((error) => {
            console.error('Error updating child:', error);
            return of(
              ParentActions.updateChildFailure({ error: error.message })
            );
          })
        )
      )
    )
  );

  searchTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.searchTasks),
      withLatestFrom(this.store.select(ParentSelectors.selectParentId)),
      switchMap(([action, parentId]) => {
        if (!parentId)
          return of(
            ParentActions.searchTasksFailure({ error: 'No parent ID' })
          );
        return this.parentService.searchTasks(parentId, action.keyword).pipe(
          map((tasks) => ParentActions.searchTasksSuccess({ tasks })),
          catchError((error) => of(ParentActions.searchTasksFailure({ error })))
        );
      })
    )
  );

  completeTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.completeTask),
      switchMap(({ parentId, childId, taskId }) =>
        this.parentService.completeTask(parentId, childId, taskId).pipe(
          map((task) => ParentActions.completeTaskSuccess({ task })),
          catchError((error) =>
            of(ParentActions.completeTaskFailure({ error }))
          )
        )
      )
    )
  );
}
