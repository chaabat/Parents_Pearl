import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChildService } from '../../core/services/child.service';
import * as ChildActions from './child.actions';
import { ChildResponse } from '../../core/models';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '../auth/auth.selectors';
import { take } from 'rxjs/operators';

@Injectable()
export class ChildEffects {
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChildActions.loadChildProfile),
      mergeMap(({ childId }) =>
        this.childService.getChildProfile(childId).pipe(
          map((profile) =>
            ChildActions.loadChildProfileSuccess({
              profile: profile as ChildResponse,
            })
          ),
          catchError((error) =>
            of(ChildActions.loadChildProfileFailure({ error }))
          )
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
      tap(action => console.log('Loading points for child:', action.childId)),
      mergeMap(({ childId }) =>
        this.childService.getMyPointHistory(childId).pipe(
          map(points => {
            console.log('Points loaded successfully:', points);
            return ChildActions.loadPointsSuccess({ points });
          }),
          catchError(error => {
            console.error('Error loading points:', error);
            return of(ChildActions.loadPointsFailure({ error }));
          })
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

  constructor(
    private actions$: Actions,
    private childService: ChildService,
    private snackBar: MatSnackBar,
    private store: Store
  ) {}
}
