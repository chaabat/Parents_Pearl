import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  map,
  mergeMap,
  catchError,
  tap,
  debounceTime,
  switchMap,
} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../core/services/admin.service';
import * as AdminActions from './admin.actions';

@Injectable()
export class AdminEffects {
  loadParents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadParents),
      tap(() => console.log('Loading parents...')),
      mergeMap(() =>
        this.adminService.getAllParents().pipe(
          tap((response) => console.log('Parents API Response:', response)),
          map((parents) => AdminActions.loadParentsSuccess({ parents })),
          catchError((error) => {
            console.error('Parents API Error:', error);
            return of(
              AdminActions.loadParentsFailure({ error: error.message })
            );
          })
        )
      )
    )
  );

  loadChildren$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadChildren),
      mergeMap(() =>
        this.adminService.getAllChildren().pipe(
          tap((response) => console.log('Children API Response:', response)),
          map((children) => AdminActions.loadChildrenSuccess({ children })),
          catchError((error) => {
            console.error('Children API Error:', error);
            return of(
              AdminActions.loadChildrenFailure({ error: error.message })
            );
          })
        )
      )
    )
  );

  loadAdmins$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAdmins),
      mergeMap(() =>
        this.adminService.getAllAdmins().pipe(
          tap((response) => console.log('Admins API Response:', response)),
          map((admins) => AdminActions.loadAdminsSuccess({ admins })),
          catchError((error) => {
            console.error('Admins API Error:', error);
            return of(AdminActions.loadAdminsFailure({ error: error.message }));
          })
        )
      )
    )
  );

  banUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.banUser),
      mergeMap(({ userId, userType }) =>
        this.adminService.banUser(userId, userType).pipe(
          map(() => AdminActions.banUserSuccess({ userId })),
          tap(() => {
            this.snackBar.open('User banned successfully', 'Close', {
              duration: 3000,
            });
          }),
          catchError((error) => {
            console.error('Ban user error:', error);
            this.snackBar.open('Failed to ban user', 'Close', {
              duration: 3000,
            });
            return of(AdminActions.banUserFailure({ error: error.message }));
          })
        )
      )
    )
  );

  unbanUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.unbanUser),
      mergeMap(({ userId, userType }) =>
        this.adminService.unbanUser(userId, userType).pipe(
          map(() => AdminActions.unbanUserSuccess({ userId })),
          tap(() => {
            this.snackBar.open('User unbanned successfully', 'Close', {
              duration: 3000,
            });
          }),
          catchError((error) => {
            console.error('Unban user error:', error);
            this.snackBar.open('Failed to unban user', 'Close', {
              duration: 3000,
            });
            return of(AdminActions.unbanUserFailure({ error: error.message }));
          })
        )
      )
    )
  );

  loadBannedUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadBannedUsers),
      mergeMap(() =>
        this.adminService.getBannedUsers().pipe(
          tap((users) => console.log('Banned users response:', users)),
          map((bannedUsers) =>
            AdminActions.loadBannedUsersSuccess({ bannedUsers })
          ),
          catchError((error) => {
            console.error('Load banned users error:', error);
            return of(
              AdminActions.loadBannedUsersFailure({ error: error.message })
            );
          })
        )
      )
    )
  );

  loadSystemStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadSystemStats),
      mergeMap(() =>
        this.adminService.getSystemStats().pipe(
          map((stats) => AdminActions.loadSystemStatsSuccess({ stats })),
          catchError((error) =>
            of(AdminActions.loadSystemStatsFailure({ error }))
          )
        )
      )
    )
  );

  // Reload data after successful operations
  reloadAfterBan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.banUserSuccess, AdminActions.unbanUserSuccess),
      mergeMap(() => [
        AdminActions.loadParents(),
        AdminActions.loadChildren(),
        AdminActions.loadAdmins(),
        AdminActions.loadBannedUsers(),
        AdminActions.loadSystemStats(),
      ])
    )
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}
}
