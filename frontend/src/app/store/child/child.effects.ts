import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ChildService } from '../../core/services/child.service';
import * as ChildActions from './child.actions';
import { ChildResponse } from '../../core/models';

@Injectable()
export class ChildEffects {
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChildActions.loadChildProfile),
      mergeMap(({ childId }) =>
        this.childService.getChildProfile(childId).pipe(
          map((profile) =>
            ChildActions.loadChildProfileSuccess({ profile: profile as ChildResponse })
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
          map(response => ChildActions.submitTaskAnswerSuccess({ taskAnswer: response })),
          catchError(error => of(ChildActions.submitTaskAnswerFailure({ error })))
        )
    )
  ));

  constructor(private actions$: Actions, private childService: ChildService) {}
}
