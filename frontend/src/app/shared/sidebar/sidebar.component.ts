import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() isOpen = true;
  userRole: string | undefined;
  isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);
  user$ = this.store.select(AuthSelectors.selectUser);

  constructor(private store: Store) {}

  ngOnInit() {
    // Get user role from localStorage on init
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userRole = user.role;
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }

    // Subscribe to user changes
    this.user$.subscribe((user: any) => {
      if (user && user.role) {
        this.userRole = user.role;
        console.log('Current user role:', this.userRole);
      }
    });
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
