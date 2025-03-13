import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { AuthService } from '../../core/services/auth.service';
import { Child } from '../../core/models/child.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  user: Child | null = null;
  defaultImage =
    'https://res.cloudinary.com/dlwyetxjd/image/upload/v1741258917/uulqrw1ytrup4txl8abb.png';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(
      (isAuth) => (this.isAuthenticated = isAuth)
    );

    this.authService.currentUser$.subscribe(user => {
      if (user?.role === 'CHILD') {
        this.user = user as Child;
      } else {
        this.user = null;
      }
    });
  }

  getProfileImage(): string {
    return this.user?.picture || this.defaultImage;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
