import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { ParentActions } from '../../store/parent/parent.actions';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ParentResolver implements Resolve<boolean> {
  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return of(false);
    }

    return of(true).pipe(
      tap(() => {
        // Dispatch actions based on the route
        switch (route.routeConfig?.path) {
          case 'children':
            this.store.dispatch(ParentActions.loadChildren());
            break;
          case 'tasks':
            this.store.dispatch(ParentActions.loadTasks());
            break;
          case 'behavior':
            this.store.dispatch(ParentActions.loadBehaviorRecords({ childId: route.params['childId'] }));
            break;
          case 'calendar':
            this.store.dispatch(ParentActions.loadCalendarEvents());
            break;
        }
      }),
      first(),
      catchError(() => {
        this.router.navigate(['/auth/login']);
        return of(false);
      })
    );
  }
} 