import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ParentService } from '../../core/services/parent.service';
import { ParentActions } from './parent.actions';

@Injectable()
export class ParentEffects {
  loadChildren$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.loadChildren),
      mergeMap(() =>
        this.parentService.getChildren().pipe(
          map(children => ParentActions.loadChildrenSuccess({ children })),
          catchError(error => of(ParentActions.loadChildrenFailure({ error: error.message })))
        )
      )
    )
  );

  addChild$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParentActions.addChild),
      mergeMap(({ child }) =>
        this.parentService.addChild(child).pipe(
          map(newChild => ParentActions.addChildSuccess({ child: newChild })),
          catchError(error => of(ParentActions.addChildFailure({ error: error.message })))
        )
      )
    )
  );

  // Add similar effects for other actions...

  constructor(
    private actions$: Actions,
    private parentService: ParentService
  ) {}
} 