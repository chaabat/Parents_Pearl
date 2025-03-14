import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MaterialModule } from '../material.module';
import { AuthService } from '../../core/services/auth.service';
import { Child } from '../../core/models/child.model';
import { Store } from '@ngrx/store';
import * as ChildSelectors from '../../store/child/child.selectors';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);
  user$ = this.store.select(AuthSelectors.selectUser);
  totalPoints$ = this.store.select(ChildSelectors.selectTotalPoints);
  defaultImage =
    'https://res.cloudinary.com/dlwyetxjd/image/upload/v1741258917/uulqrw1ytrup4txl8abb.png';

  constructor(
    private authService: AuthService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit() {
    // Debug: Monitor auth state changes
    this.isAuthenticated$.subscribe(isAuth => {
      console.log('Auth state changed:', isAuth);
    });
    
    this.user$.subscribe(user => {
      console.log('User state changed:', user);
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Logout error:', err);
        // Still navigate to login page even if logout API fails
        this.router.navigate(['/auth/login']);
      }
    });
  }

  getProfileImage(user: any): string {
    return user?.picture || this.defaultImage;
  }

  handleImageError(event: any) {
    event.target.style.display = 'none';
    // Show icon instead
    const icon = event.target.nextElementSibling;
    if (icon) {
      icon.style.display = 'block';
    }
  }
}
