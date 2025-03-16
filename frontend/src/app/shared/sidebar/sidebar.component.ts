import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';

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
  user$ = this.store.select(selectUser);

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    // Get user role from localStorage on init
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.userRole = user.role;
    }

    // Subscribe to user changes
    this.user$.subscribe((user) => {
      if (user) {
        this.userRole = user.role;
        console.log('Current user role:', this.userRole); // Debug log
      }
    });
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/auth/login']);
  }
}
