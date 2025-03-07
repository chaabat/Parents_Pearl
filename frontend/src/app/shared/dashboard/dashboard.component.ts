import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CustomDatePipe } from '../../pipe/date.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    SidebarComponent,
    CustomDatePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentDate = new Date();
  userRole: string | undefined;
  user$ = this.store.select(selectUser);
  user: any;

  constructor(private store: Store) {}

  ngOnInit() {
    this.user$.subscribe((user) => {
      this.user = user;
      this.userRole = user?.role;
    });
  }
}
