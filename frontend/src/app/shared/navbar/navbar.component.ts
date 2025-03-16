import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MaterialModule } from '../material.module';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import * as ChildSelectors from '../../store/child/child.selectors';
import { Child } from '../../core/models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);
  user$ = this.store.select(AuthSelectors.selectUser);
  totalPoints$ = this.store
    .select(ChildSelectors.selectTotalPoints)
    .pipe(map((points) => points ?? 0));

  constructor(
    private store: Store,
    private router: Router
  ) {}

  ngOnInit() {}

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  getProfileImage(user: any): string {
    return user?.profileImage || 'assets/default-avatar.png';
  }
}
