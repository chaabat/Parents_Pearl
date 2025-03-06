import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectIsAuthenticated).pipe(
      take(1),
      map((isAuthenticated) => {
        // If user is authenticated OR has a token, prevent access to auth pages
        if (isAuthenticated || localStorage.getItem('token')) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      })
    );
  }
}
