import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { selectUser } from '../../store/auth/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthResolver implements Resolve<any> {
  constructor(private store: Store) {}

  resolve(): Observable<any> {
    return this.store.select(selectUser).pipe(
      filter(user => user !== undefined),
      first(),
      tap(user => {
        if (!user) {
          // Handle initial auth state load if needed
        }
      })
    );
  }
} 