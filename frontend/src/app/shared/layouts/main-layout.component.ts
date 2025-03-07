import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CustomDatePipe } from '../../pipe/date.pipe';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    SidebarComponent,
    CustomDatePipe,
  ],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent implements OnInit {
  currentDate = new Date();
  userRole: string | undefined;
  user: any;
  sidebarOpen = true;

  constructor(private store: Store) {
    // Initialize user role from localStorage if available
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.userRole = user.role;
    }
  }

  ngOnInit() {
    this.store.select(selectUser).subscribe((user) => {
      if (user) {
        this.user = user;
        this.userRole = user.role;
        console.log('Current user role:', this.userRole); // Debug log
      }
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
