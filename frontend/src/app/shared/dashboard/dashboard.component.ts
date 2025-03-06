import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { AuthService } from '../../core/services/auth.service';
import { CustomDatePipe } from '../../pipe/date.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule, CustomDatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  userRole: string = '';
  currentDate = new Date();

  // Admin stats
  totalUsers = 0;
  activeUsers = 0;
  tasksCreated = 0;
  rewardsRedeemed = 0;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userName = user.name;
        this.userRole = user.role;
        console.log('Current user:', user); // Add this for debugging
      }
    });
  }

  generateReport() {
    // Implementation for generating reports
  }

  logout() {
    this.authService.logout();
  }
}
