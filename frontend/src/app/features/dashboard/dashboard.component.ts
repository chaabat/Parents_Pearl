import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  userRole$ = this.store.select((state) => state.auth.user?.role);
  user$ = this.store.select((state) => state.auth.user);

  constructor(private store: Store<{ auth: AuthState }>) {}
}
