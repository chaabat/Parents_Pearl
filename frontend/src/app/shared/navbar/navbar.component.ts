import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.types';
import * as AuthActions from '../../store/auth/auth.actions';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  isMenuOpen = false;
  user$ = this.store.select(state => state.auth.user);
  isAuthenticated$ = this.store.select(state => !!state.auth.user);

  constructor(private store: Store<{ auth: AuthState }>) {}

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  get isAuthenticated(): boolean {
    let isAuth = false;
    this.isAuthenticated$.subscribe(auth => isAuth = auth);
    return isAuth;
  }
}
