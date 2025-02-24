import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  userRole$ = this.store.select((state) => state.auth.user?.role);

  constructor(
    private store: Store<{ auth: AuthState }>,
    public router: Router
  ) {}
}
