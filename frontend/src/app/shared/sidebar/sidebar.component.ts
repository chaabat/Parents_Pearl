import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth/auth.actions';
import * as AuthSelectors from '../../store/auth/auth.selectors';

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
  user$ = this.store.select(AuthSelectors.selectUser);

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user) {
        this.userRole = user.role;
      }
    });
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  logout() {
    // Dispatch logout action
    this.store.dispatch(AuthActions.logout());

    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Navigate to login page
    this.router.navigate(['/auth/login']);
  }
}
