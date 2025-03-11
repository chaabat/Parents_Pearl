import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CustomDatePipe } from '../../pipe/date.pipe';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    SidebarComponent,
    CustomDatePipe,
    NgChartsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentDate = new Date();
  userRole: string | undefined;
  user$ = this.store.select(selectUser);
  user: any;
  selectedDate: Date | null = null;

  // Calendar events (example data)
  events = [
    { date: new Date(), title: 'Team Meeting' },
    { date: new Date(Date.now() + 86400000), title: 'Project Deadline' },
    { date: new Date(Date.now() + 172800000), title: 'Review Session' },
  ];

  // Chart Data
  chartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
  };

  constructor(private store: Store) {}

  ngOnInit() {
    this.user$.subscribe((user) => {
      this.user = user;
      this.userRole = user?.role;
    });
  }

  // Calendar methods
  dateClass = (date: Date) => {
    const hasEvent = this.events.some(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
    return hasEvent ? 'event-date' : '';
  };

  onDateSelected(date: Date | null) {
    if (date) {
      this.selectedDate = date;
    }
  }

  getEventsForDate(date: Date | null): any[] {
    if (!date) return [];
    return this.events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  }
}
